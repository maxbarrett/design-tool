App = Ember.Application.create();

App.Store = DS.Store.extend({
  revision: 12,
  adapter: 'DS.FixtureAdapter'
});


Ember.Handlebars.registerBoundHelper('date', function(date) {
  return moment(date).fromNow();
});
