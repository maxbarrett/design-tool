var	fs = require('fs-extra'),
	async = require('async');

var ImageController = function(ProjectModel, ImageModel, DT) {
	var instance = this;
	
	instance.readAll = function (req, res){
		var images;
		return ImageModel.find(function (err, images) {
			if (err) return errorHandler(err);
			return res.send( {'images' : images} );
		});
	};
	
	
	instance.create = function (req, res) {
		console.log("POST new image ");

		var fileName = DT.imageController.rename(req.body.image.uri),
			base64Data = req.body.image.imgdata,	
			matches = base64Data.split('base64,'),
			data = matches[1],
			buffer = new Buffer(data, 'base64'),
			targetPath = 'public/uploads/' + req.body.image.proj + '/' + fileName;
		
		// Create image record
		var image = new ImageModel({
			uri: 'uploads/' + req.body.image.proj + '/' + fileName,
			proj: req.body.image.proj
		});

		async.waterfall(
		    [
		        // i. write file to root
		        function(callback) {
					fs.writeFile(fileName, buffer, function(err){
						if (err) return errorHandler(err);
						console.log("Image " + fileName + ' uploaded');
						callback(null);
					});
		        },

		        // ii. move it into the uploads folder
		        function(callback) {
					DT.imageController.move(fileName, targetPath);
					callback(null);
		        },

		        // iii. save to DB
		        function(callback) {
					image.save(function (err) {
						if (err) return errorHandler(err);
						console.log("Image saved");
						callback(null);
					});
		        },
				
				// iv. find the project it's in
				function(callback){
					ProjectModel.findById(req.body.image.proj, function (err, project) {
						if (err) return errorHandler(err);
						
						// add new image id to project image_ids array
						project.image_ids.push(image.id);
						project.publishedAt = new Date();

						// save the project
						DT.projectController.save(project);
						return res.send({'project':project});
					});
				}
		    ],

		    // the bonus final callback function
		    function(err, status) {
		        console.log(status);
		    }
		);		
	};
	
	
	instance.readOne = function (req, res){
		var image;
		return ImageModel.findById(req.params.id, function (err, image) {
			if (err) return errorHandler(err);
			console.log('No error reading image')
			return res.send({'image':image});
		});
	};
	
	
	instance.del = function (req, res){
		ImageModel.findById(req.params.id, function (err, image) {
			if (image) {
				image.remove(function (err) {
					if (err) return errorHandler(err);
					console.log('Image db record deleted');
				});

				fs.remove('public/' + image.uri, function (err) {
					if (err) return errorHandler(err);
					console.log('Image file deleted');
				});

				ProjectModel.findById(image.proj, function (err, project) {
					// remove ref in project
					var imgs = project.image_ids;
					var i = imgs.indexOf(req.params.id);
					if (i !== -1) {
						imgs.splice(i, 1);
					}
					project.image_ids = imgs;
					console.log('Image id removed from project');
					// Save project
					DT.projectController.save(project);
					return res.send(204);
				});
			} else {
				console.log('No image to delete');
			}
		});
	};
	
	
	instance.rename = function (name){
		var concatFileName = name.replace(/\s/g, '+'),
			dotPosition = concatFileName.lastIndexOf('.'),
			date = new Date().getTime(),
			newFileName = [concatFileName.slice(0, dotPosition), '-' + date, concatFileName.slice(dotPosition)].join('');
			
		console.log('Image renamed');
		return newFileName;
	};
	
	
	instance.move = function (tmpPath, targetPath){
		fs.rename(tmpPath, targetPath, function(err) {
			if (err) return errorHandler(err);
			console.log('Image moved');
		});
	};
	
	
	// Error handler
	var errorHandler = function(err){
		console.log('We have an error...');
		console.log(err);
	}
		
}

exports.ImageController = ImageController;