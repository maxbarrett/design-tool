var ProjectController = function(ProjectModel, ImageModel, fs) {
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
		var uploadedFile = req.files.fileselect;	

		var saveImgFile = function(theFile) {	
			var concatFileName = theFile.name.replace(/\s/g, '+'),
				dotPosition = concatFileName.lastIndexOf('.'),
				date = new Date().getTime(),
				newFileName = [concatFileName.slice(0, dotPosition), '-' + date, concatFileName.slice(dotPosition)].join(''),
				tmpPath = theFile.path,
				targetPath = 'public/uploads/' + project._id + '/' + newFileName;

			// Rename image
			fs.rename(tmpPath, targetPath, function(err) {
				if (err) return errorHandler(err);
				console.log('Image renamed');
			});	

			// Create image record
			var newImages = new ImageModel({
				uri: 'uploads/' + project._id + '/' + newFileName,
				proj: project._id
			});

			// Save image
			newImages.save(function (err) {
				if (err) return errorHandler(err);
				console.log('Image saved');
			});

			// push the new image _id to the project.image_ids property
			project.image_ids.push(newImages);
		} // saveImgFile

		// if there's 1 or more image files to upload and a project title
		if (((req.files.fileselect.size > 0) || (req.files.fileselect.length > 1 )) && (req.body.title !== '')) {

			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthNow = new Date().getMonth();

			var project = new ProjectModel({
				title: req.body.title,
				month: months[monthNow],
				category: req.body.category,
				author: req.body.author
			});

			var mkdirCallback = function(){
				if (uploadedFile.length === undefined) {
					console.log('Only 1 image');
					saveImgFile(uploadedFile);
				} else if (uploadedFile.length > 1) {
					console.log('More than 1 image');
					for (var i in uploadedFile) {		
						saveImgFile(uploadedFile[i]);
					}
				}

				project.save(function (err) {
					if (err) return errorHandler(err);
					project.save();
					return console.log("Project created");
				});

				res.redirect('/#/projects');
			}

			fs.mkdir('public/uploads/' + project._id, mkdirCallback);

		} else {
			console.log('Project not saved : Image and title required');
			res.redirect('/#/projects');
		}

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

						//	next(images, project);
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
			project.images 		= thisProject.images;

			project.save(function (err) {
				if (err) return errorHandler(err);
				return res.send({'project' : project});
			});

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
	
	// Error handler
	var errorHandler = function(err){
		console.log('We have an error...');
		console.log(err);
	}
	
}

exports.ProjectController = ProjectController;