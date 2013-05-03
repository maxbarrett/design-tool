App = Ember.Application.create();

App.Store = DS.Store.extend({
	revision: 12,
	adapter: DS.RESTAdapter.create({
		url: 'http://192.168.33.10:3000/api'
	})
});


Ember.Handlebars.registerBoundHelper('date', function(date) {
  return moment(date).fromNow();
});
