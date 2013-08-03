App.Router.map(function() {
	this.resource('projects', function() {
		this.route('new');
	});
	
	this.resource('project', { path: ':project_id' });
	
	// Categories
	this.resource('branding');
	this.resource('deals');
	this.resource('email');
	this.resource('marcom');
	this.resource('most-wanted');
	this.resource('reporting');
	this.resource('app');
	this.resource('communications');
	this.resource('guidelines');
	this.resource('layout');
	this.resource('mobile');
});


App.ProjectsNewRoute = Ember.Route.extend({
	setupController: function(controller) {
		controller.newRecord();
	}
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


/////////////////////////////////////////////////////////
// Categories
/////////////////////////////////////////////////////////
App.BrandingRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'branding'});
	}
});

App.DealsRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'deals'});
	}
});

App.EmailRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'email'});
	}
});

App.MarcomRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'marcom'});
	}
});

App.MostWantedRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'most-wanted'});
	}
});

App.ReportingRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'reporting'});
	}
});

App.AppRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'app'});
	}
});

App.CommunicationsRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'communications'});
	}
});

App.GuidelinesRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'guidelines'});
	}
});

App.LayoutRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'layout'});
	}
});

App.MobileRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'mobile'});
	}
});