// CREATE
jQuery.post("/api/projects", {
	'project' : {	"title": "Project title 1",
					"category": "Marketing",
					"author": "Ed Vidicombe",
					"images": ['http://lorempixel.com/210/200/']
	}
}, function (data, textStatus, jqXHR) {
    console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
});


// UPDATE
jQuery.ajax({
    url: "/api/projects/PROJECTID",
    type: "PUT",
    data: {
		'project' : { "title": "Updated title 1",
					  "category": "NEW Marketing",
					  "author": "NEW Ed Vidicombe",
					  "images": ["http://lorempixel.com/210/200/"]
		}
    },
    success: function (data, textStatus, jqXHR) {
        console.log("Post response:");
        console.dir(data);
        console.log(textStatus);
        console.dir(jqXHR);
    }
});


// http://lorempixel.com/210/200/

// DELETE
jQuery.ajax({
    url: "/api/projects/PROJECTID", 
    type: "DELETE",
    success: function (data, textStatus, jqXHR) { 
        console.log("Post resposne:"); 
        console.dir(data); 
        console.log(textStatus); 
        console.dir(jqXHR); 
    }
});






// CREATE IMAGE
jQuery.post("/api/images", {
	'image' : {	"uri": "http://lorempixel.com/210/200/"
	}
}, function (data, textStatus, jqXHR) {
    console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
});




// {{#if isEditing}}
// 	{{partial 'project/edit'}}
// 	<button {{action 'doneEditing'}}>Done</button>
// {{else}}
// 	<button {{action 'edit'}}>Edit</button>
// {{/if}}