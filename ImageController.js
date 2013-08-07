var ImageController = function(ProjectModel, ImageModel, fs) {
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
		var filename = req.body.image.uri,
			base64Data = req.body.image.imgdata,	
			matches = base64Data.split('base64,'),
			data = matches[1],
			buffer = new Buffer(data, 'base64'),
			targetPath = 'public/uploads/' + req.body.image.proj + '/' + filename;

		// Create image record
		var image = new ImageModel({
			uri: 'uploads/' + req.body.image.proj + '/' + filename,
			proj: req.body.image.proj
		});

		// write file to root
		fs.writeFile(filename, buffer, function(err){
			if (err) return errorHandler(err);
			console.log("Image " + filename + ' uploaded');

			// then move it into the uploads folder
			fs.rename(filename, targetPath, function(err) {
				if (err) return errorHandler(err);
				console.log('Image renamed & saved');

				// Save to DB
				image.save(function (err) {
					if (err) return errorHandler(err);
					console.log("Image saved in DB");

					// find the project it's in
					ProjectModel.findById(req.body.image.proj, function (err, project) {
						if (err) return errorHandler(err);
						// add new image id to project image_ids array
						project.image_ids.push(image.id);
						project.publishedAt = new Date();

						// save the project
						project.save(function (err) {
							if (err) return errorHandler(err);
							console.log("Project updated");
							//send the response to client
							return res.send({'image':image},200);
						});//project.save
					});//findById
				});//image.save
			});//rename
		});//writeFile	
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
				image.remove(function (err) {});
				fs.remove('public/' + image.uri, function (err) {});

				ProjectModel.findById(image.proj, function (err, project) {
					// remove ref in project
					var imgs = project.image_ids;
					var i = imgs.indexOf(req.params.id);
					if (i !== -1) {
						imgs.splice(i, 1);
					}
					project.image_ids = imgs;

					// Save project
					project.save(function (err) {});
					return res.send(204);
				});
			} else {
				console.log('no image');
			}
		});
	};
		
}

exports.ImageController = ImageController;