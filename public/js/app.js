App = Ember.Application.create({ LOG_TRANSITIONS:true});

// App.Store = DS.Store.extend({
// 	revision: 12,
// 	adapter: DS.RESTAdapter.create({
// 		url: 'http://192.168.33.10:3000/api',
// 		
// 		serializer: DS.RESTSerializer.extend({
// 	        primaryKey: function(type) {
// 	            return '_id';
// 	        }
// 	    })
// 	
// 	})
// });




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
