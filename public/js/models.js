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
