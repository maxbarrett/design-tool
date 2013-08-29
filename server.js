var DT = {},
	application_root = __dirname,
    express = require("express"),
	fs = require('fs-extra'),
	async = require('async'),
    path = require("path"),
    mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ProjectController = require('./ProjectController.js').ProjectController,
	ImageController = require('./ImageController.js').ImageController,
	auth = express.basicAuth('user', 'password'),
	app = express();

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

var ProjectSchema = new Schema({ 
	title: 			String,
	publishedAt: 	{ type: Date, default: Date.now },
	month: 			String,
    category: 		String,
	author: 		String,
	image_ids: 		[{ type: Schema.Types.ObjectId, ref: 'Image' }]
});

var ImageSchema = new Schema({
	uri: 		String,
	proj: 		{ type: Schema.Types.ObjectId, ref: 'Project' },
	imgdata: 	String
});

var ProjectModel = mongoose.model('Project', ProjectSchema);
var ImageModel = mongoose.model('Image', ImageSchema);


// Homepage route
app.get('/', auth, function(req, res) {
	// console.log(auth);
 	res.sendfile('public/index.html');
});


// Mongo Database
mongoose.connect('mongodb://192.168.33.10:27017/test', function(err){
  if (err) return errorHandler(err);
	console.log('Connected to mongodb://192.168.33.10:27017/test successfully!');
});

DT.projectController = new ProjectController(ProjectModel, ImageModel, DT);
DT.imageController = new ImageController(ProjectModel, ImageModel, DT);

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
app.get('/api', auth, function (req, res) {
  res.send('API is running!');
});


/////////////////////////////////////////////////////////////////
// REST API FOR PROJECTS

// READ a List of Projects
app.get('/api/projects', auth, DT.projectController.readAll);

// CREATE a project
app.post('/api/projects', auth, DT.projectController.create);

// READ a Single Project by ID
app.get('/api/projects/:id', auth, DT.projectController.readOne);

// UPDATE a Single Project by ID
app.put('/api/projects/:id', auth, DT.projectController.update);

// DELETE a Single Project by ID
app.delete('/api/projects/:id', auth, DT.projectController.del);



/////////////////////////////////////////////////////////////////
// REST API FOR IMAGES

// READ a List of Images
app.get('/api/images', auth, DT.imageController.readAll);

// Add an image to existing project
app.post('/api/images', auth, DT.imageController.create);

// READ a Single Image by ID
app.get('/api/images/:id', auth, DT.imageController.readOne);

// DELETE a Single Image by ID
app.delete('/api/images/:id', auth, DT.imageController.del);



// Launch server
app.listen(3000);
console.log('listening on port 3000');

