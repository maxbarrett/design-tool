App = Ember.Application.create({ LOG_TRANSITIONS:true});


App.RESTAdapter = DS.RESTAdapter.extend({
    url: 'http://192.168.33.10:3000/api',

    serializer: DS.RESTSerializer.extend({
        primaryKey: function(type) {
            return '_id';
        }
    })
});


App.Store = DS.Store.extend({
    revision: 12,
    adapter: App.RESTAdapter
});


Ember.Handlebars.registerBoundHelper('date', function(date) {
  return moment(date).fromNow();
});


// Enable html5 required attribute for text fields
App.TextField = Ember.TextField.extend({
    attributeBindings: 'required'
});