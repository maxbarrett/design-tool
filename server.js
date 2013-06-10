var application_root = __dirname,
    express = require("express"),
	fs = require('fs'),
	fs = require('fs-extra'),
    path = require("path"),
    mongoose = require('mongoose');

var app = express();


// Express Config
app.configure(function () {
	app.use(express.bodyParser({
		uploadDir:'./public/uploads',
		keepExtensions: true
	}));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// Authenticator
auth = express.basicAuth('user', 'password');

// Homepage route
app.get('/', auth, function(req, res) {
	// console.log(auth);
 	res.sendfile('public/index.html');
});


// Mongo Database
mongoose.connect('mongodb://192.168.33.10:27017/test', function(err){
  if (err) {
    console.log('Could not connect to mongo');
	console.log(err);
  } else {
	console.log('Connected to mongodb://192.168.33.10:27017/test successfully!');
}
});


// Define Schema
var Schema   = mongoose.Schema;


// Create Project Schema
var ProjectSchema = new Schema({ 
	title: 			String,
	publishedAt: 	{ type: Date, default: Date.now },
    category: 		String,
	author: 		String,
	image_ids: 		[{ type: Schema.Types.ObjectId, ref: 'Image' }]
});

// Create project record type
var ProjectModel = mongoose.model('Project', ProjectSchema);


// Create Image Schema
var ImageSchema = new Schema({
	uri: 		String,
	proj: 		{ type: Schema.Types.ObjectId, ref: 'Project' }
});

// Create Image record type
var ImageModel = mongoose.model('Image', ImageSchema);


// // Delete all projects
// var tt = ProjectModel.find(function(err,doc){
//   console.log(doc);
// });
// tt.remove();
// 
// // Delete all images
// var tt = ImageModel.find(function(err,doc){
//   console.log(doc);
// });
// tt.remove();


// Setup the RESTful web service endpoint
app.get('/api', function (req, res) {
  res.send('API is running!');
});


// READ a List of Projects
app.get('/api/projects', function (req, res){
	return ProjectModel.find(function (err, projects) {
		if (!err) {
			return res.send( {'projects' : projects} );
		} else {
			return console.log(err);
		}
	});
});


// CREATE a project
app.post('/api/projects', function (req, res){
	
	// Grab the file(s) uploaded
	var uploadedFile = req.files.uploadingFile;	
	var project = new ProjectModel({
		title: req.body.title,
		// publishedAt: req.body.project.publishedAt,
		category: req.body.category,
		author: req.body.author
	});

	// reusable function
	var populateData = function(theFile) {	
		var concatFileName = theFile.name.replace(/ /g, '+');
		var dotPosition = concatFileName.lastIndexOf('.');
		var date = new Date().getTime();
		var newFileName = [concatFileName.slice(0, dotPosition), '-' + date, concatFileName.slice(dotPosition)].join('');
		var tmpPath = theFile.path;
		var targetPath = 'public/uploads/' + newFileName;
		
		fs.rename(tmpPath, targetPath, function(err) {
			
			if (err) {
				console.log(err);
			} else {
				fs.unlink(tmpPath, function() {
					if (err) {
						console.log(err)
					} else {
						// res.send('File Uploaded to ' + targetPath + ' - ' + theFile.size + ' bytes');
						console.log('File Uploaded to ' + targetPath + ' - ' + theFile.size + ' bytes')
					}
				});
			}
		});	
		
		
		// create image
		var newImages = new ImageModel({
			uri: 'uploads/' + newFileName,
			proj: project._id
		});

		// create a new image record
		newImages.save(function (err) {
			if (!err) {
				console.log('Saved image');
			} else {
				console.log('Error saving image:');
				console.log(err);
			}
		});

		// push the new image _id to the project.image_ids property
		project.image_ids.push(newImages);
		
	} // populateData


	// Save the project
	var saveProj = function() { 
		project.save(function (err) {
			if (!err) {
				project.save();
				return console.log("Project created");
			} else {
				console.log('Error saving project');
				return console.log(err);
			}
		});
	}

	// try/catch here?
	if (uploadedFile.size === 0) {
		
		console.log('No image to upload')
		res.redirect('/');
		
	} else if (uploadedFile.length > 1) {
		
		console.log('More than 1 image');
		for (var i in uploadedFile) {		
			populateData(uploadedFile[i]);
		}
		saveProj();
		res.redirect('/');
		
	} else if (uploadedFile.length === undefined) {

		console.log('Only 1 image');
		populateData(uploadedFile);
		saveProj();
		res.redirect('/');
		
	} else {
		console.log('No idea then?!');
		res.redirect('/');
	}
	
});


// READ a Single Project by ID
app.get('/api/projects/:id', function (req, res){
	return ProjectModel.findById(req.params.id, function (err, project) {
		if (!err) {
			console.log('No error reading a project');
			return res.send({'project':project});
		} else {
			console.log('Error reading a project');
			return console.log(err);
		}
	});
});


// UPDATE a Single Project by ID
app.put('/api/projects/:id', function (req, res){

	return ProjectModel.findById(req.params.id, function (err, project) {
		
		var thisProject = req.body.project;
		// project.title = (thisProject.title !== undefined) ? thisProject.title : project.title;
		// project.category = (thisProject.category !== undefined) ? thisProject.category : project.category;
		// project.author = (thisProject.author !== undefined) ? thisProject.author : project.author;
		// project.images = (thisProject.images !== undefined) ? thisProject.images : project.images;
		console.log(thisProject);
		project.title = thisProject.title;
		project.category = thisProject.category;
		project.author = thisProject.author;
		project.images = thisProject.images;
		
		return project.save(function (err) {
			if (!err) {
				console.log("Project updated");
			} else {
				console.log("Error updating project");
				console.log(err);
			}
			
			console.log(project);
			return res.send({'project' : project});
		});
		
	});
});


// DELETE a Single Project by ID
app.delete('/api/projects/:id', function (req, res){
	return ProjectModel.findById(req.params.id, function (err, project) {
		
		var len = project.image_ids.length; 
		
		if (len) {
			for (var i = 0; i < len; i++) {			
				ImageModel.findById(project.image_ids[i], function (err, image) {
					return image.remove(function (err) {
						if (!err) {
							fs.remove('public/' + image.uri, function (err) {
								if (err) {
									console.log(err);
								} else {
									console.log('Successfully deleted image from fs');
								}
							});

						} else {
							console.log(err);
						}
					});
				});
			}
		}
		
		return project.remove(function (err) {
			if (!err) {
				console.log("removed project");
				return res.send({status : 'ok'});
			} else {
				console.log(err);
			}
		});
	});
});


/////////////////////////////////////////////////////////
// REST API FOR IMAGES
/////////////////////////////////////////////////////////


// READ a List of Images
app.get('/api/images', function (req, res){
	var images;
	return ImageModel.find(function (err, images) {
		if (!err) {
			return res.send( {'images' : images} );
		} else {
			return console.log(err);
		}
	});
});

// CREATE an image
app.post('/api/images', function (req, res){
	var image;
	console.log("POST: ");
	console.log(req.body);
	
	image = new ImageModel({
		uri: req.body.image_ids.uri
	});
	
	image.save(function (err) {
		if (!err) {
			return console.log("created");
		} else {
			return console.log(err);
		}
	});

	return res.send( {'image' : image} );
});

// READ a Single Image by ID
app.get('/api/images/:id', function (req, res){
	var image;
	console.log(req.params.id)
	return ImageModel.findById(req.params.id, function (err, image) {
		if (!err) {
			console.log('No error reading image')
			return res.send({'image':image});
		} else {
			console.log('Error reading image')
			return console.log(err);
		}
	});
});

// DELETE a Single Image by ID
app.delete('/api/images/:id', function (req, res){
	console.log('Trying to delete image');
	var image; 
	
	return ImageModel.findById(req.params.id, function (err, image) {
		return image.remove(function (err) {
			if (!err) {
				
				fs.remove('public/' + image.uri, function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log('Successfully deleted image from fs');
						
						ProjectModel.findById(image.proj, function (err, project) {
							var imgs = project.image_ids;
							console.log(imgs);
							
							var i = imgs.indexOf(req.params.id);
							if(i !== -1) {
								imgs.splice(i, 1);
							}
							
							project.image_ids = imgs;
							
							return project.save(function (err) {
								if (!err) {
									console.log("Project updated (removed image_id from array)");
								} else {
									console.log("Error updating project image_ids");
									console.log(err);
								}

								console.log(project);
								return res.send({'project' : project});
							});
						
						});
						
						
					//	return res.send('');
					}
				});
				
			} else {
				console.log(err);
			}
		});
	});
});



// Launch server
app.listen(3000);
console.log('listening on port 3000');

