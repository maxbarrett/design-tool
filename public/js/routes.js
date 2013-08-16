App.Router.map(function() {
	this.resource('projects');
	this.route('new');

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


App.NewRoute = Ember.Route.extend({
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
	},
	renderTemplate: function() {
		var controller = this.controllerFor('branding');

		// Render the 'branding' template
		// and display the 'branding' controller
		this.render('projects', {
			controller: controller
		});
	}
});

App.DealsRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'deals'});
	},
	renderTemplate: function() {
		var controller = this.controllerFor('deals');
		this.render('projects', {
			controller: controller
		});
	}
});

App.EmailRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'email'});
	},
	renderTemplate: function() {
		var controller = this.controllerFor('email');
		this.render('projects', {
			controller: controller
		});
	}
});

App.MarcomRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'marcom'});
	},
	renderTemplate: function() {
		var controller = this.controllerFor('marcom');
		this.render('projects', {
			controller: controller
		});
	}
});

App.MostWantedRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'most-wanted'});
	},
	renderTemplate: function() {
		var controller = this.controllerFor('most-wanted');
		this.render('projects', {
			controller: controller
		});
	}
});

App.ReportingRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'reporting'});
	},
	renderTemplate: function() {
		var controller = this.controllerFor('reporting');
		this.render('projects', {
			controller: controller
		});
	}
});

App.AppRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'app'});
	},
	renderTemplate: function() {
		var controller = this.controllerFor('app');
		this.render('projects', {
			controller: controller
		});
	}
});

App.CommunicationsRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'communications'});
	},
	renderTemplate: function() {
		var controller = this.controllerFor('communications');
		this.render('projects', {
			controller: controller
		});
	}
});

App.GuidelinesRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'guidelines'});
	},
	renderTemplate: function() {
		var controller = this.controllerFor('guidelines');
		this.render('projects', {
			controller: controller
		});
	}
});

App.LayoutRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'layout'});
	},
	renderTemplate: function() {
		var controller = this.controllerFor('layout');
		this.render('projects', {
			controller: controller
		});
	}
});

App.MobileRoute = Ember.Route.extend({
	model: function() {
		return App.Project.find({category: 'mobile'});
	},
	renderTemplate: function() {
		var controller = this.controllerFor('mobile');
		this.render('projects', {
			controller: controller
		});
	}
});