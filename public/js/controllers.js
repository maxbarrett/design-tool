App.ProjectController = Ember.ObjectController.extend({
  isEditing: false,

  edit: function() {
    this.set('isEditing', true);
  },

  doneEditing: function (){
    this.set('isEditing', false);
	// update the publish date now that we have finished editing
	// this.set('publishedAt', new Date());
    this.get('store').commit();
	this.get('target.router').transitionTo('projects.index');
  },

  save: function() {
      this.get('store').commit();
      this.get('target.router').transitionTo('projects.index');
  },

  destroyRecord: function() {
    if (window.confirm("Are you sure you want to delete this project?")) {
      this.get('content').deleteRecord();
      this.get('store').commit();
      this.get('target.router').transitionTo('projects.index');
    }
  }
});


App.ProjectsNewController = Ember.ObjectController.extend({
	
	newRecord: function() {
		console.log('new record');	
		this.set('content', App.Project.createRecord({title: ''}));
		
		// TODO: create a transaction		
		// this.transaction = this.get('store').transaction();
		// this.set('content', this.transaction.createRecord(App.Project));
	},
	
	bindImgs: function(evt){
		var files = []
		var len = evt.target.files.length; 
		
		for (var i = 0; i < len; i++) {
			files.push(evt.target.files[i].name);
		}
		console.log(files);

		// this.transaction = this.get('store').transaction();
		// this.transaction.pushObject(files);
		// TODO: add files to the transaction
	},
	
	save: function() {
		this.get('store').commit();
		console.log('save');
		this.get('target.router').transitionTo('projects.index');	
	}	
});








// App.UploadController = Ember.ObjectController.extend({
//     files: null,
// 
//     fileSelectionChanged: function(evt) {
//         var inputFiles = evt.target.files;
//         var files = [];
//         for (var i = 0, f; f = inputFiles[i]; i++) {
//             files.pushObject({
//                 name: escape(f.name),
//                 type: f.type || 'n/a', 
//                 size: f.size,
//                 date: f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'
//             });
//         }
//         this.set('files', files);
//     }
// });

// // Sort the projects by date, newest first
// App.projectsController = Ember.ArrayController.create({
//   content: App.Project.FIXTURES,
//   sortProperties: ['publishedAt'],
//   sortAscending: false
// });
// // Grab the first one
// console.log(App.projectsController.get('firstObject'));