App.Project = DS.Model.extend({
	title: DS.attr('string'),
	publishedAt: DS.attr('date'),
	category: DS.attr('string'),
	author: DS.attr('string'),
	images: DS.hasMany('App.Image')
});

App.Image = DS.Model.extend({
	uri:  DS.attr('string'),
	proj: DS.attr('string')
});







// DUMMY DATA
// App.Project.FIXTURES = [{
// 	id: 1,
// 	title: "Dealio",
// 	author: "Sam King",
// 	publishedAt: new Date('12-27-2012'),
// 	images: [401, 400, 402]
// }, {
// 	id: 2,
// 	title: "Partner Reporting",
// 	author: "Tim Davey",
// 	publishedAt: new Date('12-30-2011'),
// 	images: [401, 400, 402]
// }, {
// 	id: 3,
// 	title: "Another project",
// 	author: "Humberto De Souza",
// 	publishedAt: new Date('01-15-2013'),
// 	images: [401, 400, 402]
// }];
// 
// 
// App.Image.FIXTURES = [{
// 	id:400,
// 	uri: 'http://lorempixel.com/200/200/'
// }, {
// 	id:401,
// 	uri: 'http://lorempixel.com/200/210/'
// }, {
// 	id:402,
// 	uri: 'http://lorempixel.com/200/220/'	
// }]




