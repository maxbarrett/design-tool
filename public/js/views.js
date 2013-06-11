App.removeImage = Ember.View.extend({
	tagName: "span",
	classNames: ['rm-img'],
	didInsertElement: function() {
		this.$().html('Remove image');
	},
	
	click: function(e){
		var del = $(e.target),
			img = del.prev('img'),
			imgId = img.data('img');
			
		jQuery.ajax({
		    url: "/api/images/" + imgId, 
		    type: "DELETE",
		    success: function (data, textStatus, jqXHR) { 
		        console.log("Post resposne:"); 
		        console.dir(data); 
		        console.log(textStatus); 
		        console.dir(jqXHR);
				del.parent('li').remove();
		    }
		});	
	}
});

