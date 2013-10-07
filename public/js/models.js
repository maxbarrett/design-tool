App.Project = DS.Model.extend({
	title: DS.attr('string'),
	publishedAt: DS.attr('date'),
	month: DS.attr('string'),
	category: DS.attr('string'),
	images: DS.hasMany('App.Image')
});

App.Image = DS.Model.extend({
	uri:  DS.attr('string'),
	project: DS.belongsTo('App.Project')
});






// // DUMMY DATA
// App.Project.FIXTURES = [{
// 	id: 1,
// 	title: "Project title",
// 	images: [400]
// },{
// 	id: 2,
// 	title: "2nd title",
// 	images: [400, 500]
// }];
// App.Image.FIXTURES = [{
// 	id:400,
// 	uri: 'http://lorempixel.com/100/100/'
// },{
// 	id:500,
// 	uri: 'http://lorempixel.com/100/110/'
// }];