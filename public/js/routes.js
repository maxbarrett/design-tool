App.Router.map(function() {
	this.resource('projects', function() {
		this.resource('project', { path: ':project_id' });
	});

	this.resource('upload');
});


// Projects route: find all projects
App.ProjectsRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find();
	}
});


// Redirect to the /projects route on page load
App.IndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('projects');
	}
});