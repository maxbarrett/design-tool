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

// MAGIC ERROR HANDLER
function errorHandler(err){
	console.log('We have an error...');
	console.log(err);
}

// Mongo Database
mongoose.connect('mongodb://192.168.33.10:27017/test', function(err){
  if (err) return errorHandler(err);
	console.log('Connected to mongodb://192.168.33.10:27017/test successfully!');
});


// Define Schema
var Schema = mongoose.Schema;

// Create Project Schema
var ProjectSchema = new Schema({ 
	title: 			String,
	publishedAt: 	{ type: Date, default: Date.now },
	month: 			String,
    category: 		String,
	author: 		String,
	image_ids: 		[{ type: Schema.Types.ObjectId, ref: 'Image' }]
});

// Create project record type
var ProjectModel = mongoose.model('Project', ProjectSchema);


// Create Image Schema
var ImageSchema = new Schema({
	uri: 		String,
	proj: 		{ type: Schema.Types.ObjectId, ref: 'Project' },
	imgdata: 	String
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
	
	var query = req.query.category;
	
	if (query) {
		ProjectModel.where('category', query).find({}).sort({publishedAt: -1}).execFind(function(err,projects){
			if (err) return errorHandler(err);
			return res.send( {'projects' : projects} );
		});	
	} else {
		
		// sort projects in chronological order
		ProjectModel.find({}).sort({publishedAt: -1}).execFind(function(err,projects){
			return res.send( {'projects' : projects} );
		});
		
	}
});


// CREATE a project
app.post('/api/projects', function (req, res){
	var uploadedFile = req.files.fileselect;	
	// reusable function
	var saveImgFile = function(theFile) {	
		var concatFileName = theFile.name.replace(/ /g, '+');
		var	dotPosition = concatFileName.lastIndexOf('.');
		var	date = new Date().getTime();
		var	newFileName = [concatFileName.slice(0, dotPosition), '-' + date, concatFileName.slice(dotPosition)].join('');
		var	tmpPath = theFile.path;
		var	targetPath = 'public/uploads/' + project._id + '/' + newFileName;

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


	// Save the project
	var saveProj = function() { 
		project.save(function (err) {
			if (err) return errorHandler(err);
			project.save();
			return console.log("Project created");
		});
	}

	
	// if there's 1 or more image files to upload and a project title
	if (((req.files.fileselect.size > 0) || (req.files.fileselect.length > 1 )) && (req.body.title !== '')) {

		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var monthNow = new Date().getMonth();
		
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
			saveProj();
			res.redirect('/');
		}
	
		fs.mkdir('public/uploads/' + project._id, mkdirCallback);

	} else {
		console.log('Project not saved : Image and title required');
		res.redirect('/');
	}
	
});


// READ a Single Project by ID
app.get('/api/projects/:id', function (req, res){

	var findProj = function(projId, next){
		ProjectModel.findById(projId, function (err, project) {
			if (err) return errorHandler(err);
			if (project.image_ids.length){
			
				ImageModel.find( {proj: projId}, {},  {sort: {uri:1}}, function (err, images) {
					if (err) return errorHandler(err);
					if (images){
						next(images, project);
					} else { console.log('No images'); }
				});
			
			} else {
				return res.send({'project':project});
			}
		});
	}

	findProj(req.params.id, function(imgsArr, project){
		var resData = { 'project':project, 'images':imgsArr };
		res.send(resData);
	});
	
});


// UPDATE a Single Project by ID
app.put('/api/projects/:id', function (req, res){

	ProjectModel.findById(req.params.id, function (err, project) {
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var monthNow = new Date().getMonth();
		var thisProject = req.body.project;
		
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
});


// DELETE a Single Project by ID
app.delete('/api/projects/:id', function (req, res){
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
});


/////////////////////////////////////////////////////////
// REST API FOR IMAGES
/////////////////////////////////////////////////////////

// READ a List of Images
app.get('/api/images', function (req, res){
	var images;
	return ImageModel.find(function (err, images) {
		if (err) return errorHandler(err);
		return res.send( {'images' : images} );
	});
});


// Add an image to existing project
app.post('/api/images', function (req, res){

	console.log("POST new image ");
	var filename = req.body.image.uri;
	var base64Data = req.body.image.imgdata;	
	// var regex = /^data:.+\/(.+);base64,(.*)$/;
	// var matches = base64Data.match(regex);
	// var ext = matches[1];
	// var data = matches[2];
	var matches = base64Data.split('base64,');
	var data = matches[1];
	
	var buffer = new Buffer(data, 'base64');
	var	targetPath = 'public/uploads/' + req.body.image.proj + '/' + filename;

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
});


// READ a Single Image by ID
app.get('/api/images/:id', function (req, res){
	var image;
	return ImageModel.findById(req.params.id, function (err, image) {
		if (err) return errorHandler(err);
		console.log('No error reading image')
		return res.send({'image':image});
	});
});


// DELETE a Single Image by ID
app.delete('/api/images/:id', function (req, res){
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
});


// Launch server
app.listen(3000);
console.log('listening on port 3000');

