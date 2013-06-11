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
		// this.get('target.router').transitionTo('projects.index');
	},

	save: function() {
		this.get('store').commit();
		this.get('target.router').transitionTo('projects.index');
	},

	destroyRecord: function() {
		if (window.confirm("Are you sure you want to delete this project?")) {
			this.get('content').deleteRecord();
			this.get('store').commit();
			// ERROR ON TRANSITION
			this.get('target.router').transitionTo('projects.index');
		}
	}
});


App.ProjectsNewController = Ember.ObjectController.extend({
	
	newRecord: function() {
		console.log('new record');	
		this.set('content', App.Project.createRecord({title: ''}));
	},
	
	// bindImgs: function(evt){
	// 	var files = []
	// 	var len = evt.target.files.length; 
	// 	
	// 	for (var i = 0; i < len; i++) {
	// 		files.push(evt.target.files[i].name);
	// 	}
	// 	console.log(files);
	// 	// this.transaction = this.get('store').transaction();
	// 	// this.transaction.pushObject(files);
	// 	// TODO: add files to the transaction
	// },
	
	save: function() {
		this.get('store').commit();
		console.log('save');
		this.get('target.router').transitionTo('projects.index');	
	}	
});
