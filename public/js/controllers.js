App.ProjectController = Ember.ObjectController.extend({
  isEditing: false,
  edit: function() {
    this.set('isEditing', true);
  },
  doneEditing: function (){
    this.set('isEditing', false);
	// update the publish date now that we have finished editing
	this.set('publishedAt', new Date());
    this.get('store').commit();
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