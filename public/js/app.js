App = Ember.Application.create({ 
	LOG_TRANSITIONS:true
});

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
	//adapter: 'DS.FixtureAdapter'
});


Ember.Handlebars.registerBoundHelper('date', function(date) {
  return moment(date).fromNow();
});


// Enable html5 required attribute for text fields
App.TextField = Ember.TextField.extend({
    attributeBindings: 'required'
});

// Create html5 file input element
App.FileField = Ember.TextField.extend({
    type: 'file',
	attributeBindings: ['name'],
    multiple : true,
    change: function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.get('controller').bindImgs(evt);
    }
});

// Create hidden input
App.InputField = Ember.TextField.extend({
    type: 'hidden'
});




