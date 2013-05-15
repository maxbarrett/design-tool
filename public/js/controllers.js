App.ProjectController = Ember.ObjectController.extend({
  isEditing: false,

  edit: function() {
    this.set('isEditing', true);
  },

// DONE EDITING CREATES AN EMPTY PROJECT ******
  doneEditing: function (){
    this.set('isEditing', false);
	// update the publish date now that we have finished editing
	// this.set('publishedAt', new Date());
    this.get('store').commit();
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
	save: function() {
		this.get('store').commit();
		this.get('target.router').transitionTo('projects.index');
	// THIS RELOAD CREATES AN EMPTY PROJECT ON EDIT ********
	//	location.reload();
	},

	newRecord: function() {
		this.set('content', App.Project.createRecord({title: ''}));
	}
});


// // Sort the projects by date, newest first
// App.projectsController = Ember.ArrayController.create({
//   content: App.Project.FIXTURES,
//   sortProperties: ['publishedAt'],
//   sortAscending: false
// });
// // Grab the first one
// console.log(App.projectsController.get('firstObject'));