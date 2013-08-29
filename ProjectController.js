var	fs = require('fs-extra'),
	async = require('async');

var ProjectController = function(ProjectModel, ImageModel, DT) {
	var instance = this;

	instance.readAll = function(req, res) {
		var query = req.query.category;
		if (query) {
			ProjectModel.where('category', query).find({}).sort({publishedAt: -1}).execFind(function(err,projects){
				if (err) return errorHandler(err);
				return res.send( {'projects' : projects} );
			});	
		} else {
			// sort projects in chronological order
			ProjectModel.find({}).sort({publishedAt: -1}).execFind(function(err,projects){
				if (err) return errorHandler(err);
				return res.send( {'projects' : projects} );
			});
		}
	};
	
	
	instance.create = function(req, res) {			
		async.waterfall(
		    [
		        // i. Save project (to create id for image), create image directory
		        function(callback) {

					var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
						monthNow = new Date().getMonth(),
						files = req.files.files ? req.files.files : null;

					var project = new ProjectModel({
						title: req.body.title,
						month: months[monthNow],
						category: req.body.category,
						author: req.body.author
					});
					
					DT.projectController.save(project);
					
					if (files){
						fs.mkdir('public/uploads/' + project._id, callback(null, files, project));
					} else {
						console.log('No images, dir not created');
					}
		        },

		        // ii. Iterate depending on number of images
		        function(files, project, callback) {
					if (files && files.length === undefined) {
						console.log('Only 1 image');
						callback(null, files, project);
					} else if (files.length > 1) {
						console.log('More than 1 image');
						for (var i in files) {		
							callback(null, files[i], project);
						}
					}
		        },

		        // iii. Rename/move/save image, push id to project
		        function(theFile, project, callback) {
			
					var fileName = DT.imageController.rename(theFile.name),
						tmpPath = theFile.path,
						targetPath = 'public/uploads/' + project._id + '/' + fileName;

					// Move image
					DT.imageController.move(tmpPath, targetPath);

					// Create image record
					var newImage = new ImageModel({
						uri: 'uploads/' + project._id + '/' + fileName,
						proj: project._id
					});

					// Save image
					newImage.save(function (err) {
						if (err) return errorHandler(err);
						console.log('Image saved');
					});

					// push the new image _id to the project.image_ids property
					project.image_ids.push(newImage);
					
					callback(null, project);

		        },
				
				// iv. Save project again
				function(project, callback){
					DT.projectController.save(project);
					// res.json(200);
					return res.send({'project':project});
				}
		    ],

		    // the bonus final callback function
		    function(err) {
		        if (err) return errorHandler(err);
		    }
		);
	}; // create
		
	
	instance.readOne = function (req, res){
		ProjectModel.findById(req.params.id, function (err, project) {
			if (err) return errorHandler(err);
			if (project.image_ids.length){

				ImageModel.find( {proj: req.params.id}, {},  {sort: {uri:1}}, function (err, images) {
					if (err) return errorHandler(err);
					if (images){
						var resData = { 'project':project, 'images':images };
						res.send(resData);
					} else { 
						console.log('No images');
						res.send({status:'error'});
					}
				});

			} else {
				return res.send({'project':project});
			}
		});
	};
	
	
	instance.update = function (req, res){

		ProjectModel.findById(req.params.id, function (err, project) {
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthNow = new Date().getMonth(),
				thisProject = req.body.project;

			project.title 		= thisProject.title;
			project.category 	= thisProject.category;
			project.author 		= thisProject.author;
			project.month 		= months[monthNow];
			project.publishedAt = new Date();

			DT.projectController.save(project);
		});
	};
	
	
	instance.del = function (req, res){
		ProjectModel.findById(req.params.id, function (err, project) {

			if (project) {
				fs.delete('public/uploads/' + project._id);
				ImageModel.where('proj').equals(project._id).remove();

				project.remove(function (err) {
					if (err) return errorHandler(err);
				});

				console.log('Project deleted');
				res.json(200);
			}

		});
	};
	
	
	instance.save = function(project){
		project.save(function (err) {
			if (err) return errorHandler(err);
			console.log("Project saved");
		});
	};

	
	// Error handler
	var errorHandler = function(err){
		console.log('We have an error...');
		console.log(err);
	}
	
}

exports.ProjectController = ProjectController;