var application_root = __dirname,
    express = require("express"),
	fs = require('fs'),
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
	uri: 		String
});

// Create Image record type
var ImageModel = mongoose.model('Image', ImageSchema);


// // Populate new record
// var newProject = new ProjectModel({
//     id: 			99,
// 	title: 			'Test Name',
// 	author: 		'Mongo User',
// 	image: 			'http://lorempixel.com/180/179/'
// });
// 
// // Save that record
// newProject.save(function(err) {
//   if (err) {
//     console.log('Could not save new project');
//   } else {
//     console.log('New project saved!');
//   }
// });
// 
// Delete specific projects
// var findDocument = ProjectModel.find({ 'title': '' });
// findDocument.remove();


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


// CREATE a single Project
app.post('/api/projects', function (req, res){
	
	console.log(req.files);
	var project;
	console.log("POST: ");
	console.log(req.body);
	
	// reusable rename file function
	var renamingFunc = function(theFile) {	

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
						res.send('File Uploaded to ' + targetPath + ' - ' + theFile.size + ' bytes');
					}
				});
			}
		});	
	}
	
	
	
	
	// // Grab the file(s) uploaded
	// var uploadedFile = req.files.uploadingFile;
	// 
	// // if > 1 file
	// if ( uploadedFile.length ) {	
	// 	for (var i in uploadedFile) {		
	// 		renamingFunc(uploadedFile[i])
	// 	}
	// // otherwise 1 file
	// } else {
	// 	renamingFunc(uploadedFile)
	// }
	
	
	
	
	project = new ProjectModel({
		title: req.body.project.title,
		// publishedAt: req.body.project.publishedAt,
		category: req.body.project.category,
		author: req.body.project.author
	});

	project.save(function (err) {
		if (!err) {
			
			if (req.body.project.images.length) {
				for (var i = req.body.project.images.length - 1; i >= 0; i -= 1) {
			
					var newImages = new ImageModel({
						uri: req.body.project.images[i]
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
			
				} // for in
			} // if images

			project.save();
			
			return console.log("created");
		} else {
			console.log('Error saving project');
			return console.log(err);
		}
	});

	return res.send( {'project' : project} );
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
		return project.remove(function (err) {
			if (!err) {
				console.log("removed project");
				return res.send('');
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
	console.log(req.params.id)
	var image;
	
	return ImageModel.findById(req.params.id, function (err, image) {
		return image.remove(function (err) {
			if (!err) {
				console.log("removed");
				return res.send('');
			} else {
				console.log(err);
			}
		});
	});
});







// TEST =========================================================

// app.get('/api/fileUpload', function (req, res) {
//   res.send('API is running! WOO');
// });

// Create an endpoint for uploading images test
app.post('/api/fileUpload', function(req, res) {

	// reusable renaming function
	var renamingFunc = function(theFile) {	

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
						res.send('File Uploaded to ' + targetPath + ' - ' + theFile.size + ' bytes');
					}
				});
			}
		});	
	}
	
	// Grab the file(s) uploaded
	var uploadedFile = req.files.uploadingFile;

	// if > 1 file
	if ( uploadedFile.length ) {	
		for (var i in uploadedFile) {		
			renamingFunc(uploadedFile[i])
		}
	// otherwise 1 file
	} else {
		renamingFunc(uploadedFile)
	}

});

// TEST =========================================================





// Launch server
app.listen(3000);
console.log('listening on port 3000');




