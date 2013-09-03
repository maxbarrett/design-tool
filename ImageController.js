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
		// Not required, all images are added
		// as part of a project 'POST' or 'PUT'.
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

	
	instance.save = function (project, fileName){
		// Create image record
		var image = new ImageModel({
			uri: 'uploads/' + project._id + '/' + fileName,
			proj: project._id
		});
		
		// Save image
		image.save(function (err) {
			if (err) return errorHandler(err);
			console.log('Image saved');
		});
		
		// push the new image _id to the project.image_ids property
		project.image_ids.push(image);
	};
	
	
	// Error handler
	var errorHandler = function(err){
		console.log('We have an error...');
		console.log(err);
	}
		
}

exports.ImageController = ImageController;