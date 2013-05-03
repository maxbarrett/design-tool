// CREATE
jQuery.post("/api/projects", {
  "id" : 1,
  "title": "Project title 1",
  "category": "Marketing",
  "author": "Ed Vidicombe",
  "image": "http://lorempixel.com/200/200/"
}, function (data, textStatus, jqXHR) {
    console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
});


// UPDATE
jQuery.ajax({
    url: "/api/projects/PROJECTID",
    type: "PUT",
    data: {
	  "title": "Updated title 1",
	  "category": "NEW Marketing",
	  "author": "NEW Ed Vidicombe",
	  "image": "http://lorempixel.com/200/200/"
    },
    success: function (data, textStatus, jqXHR) {
        console.log("Post resposne:");
        console.dir(data);
        console.log(textStatus);
        console.dir(jqXHR);
    }
});




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