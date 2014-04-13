Template.tag_display.questions = function(tag_name) {

	return Questions.find({tags: tag_name});

}


Template.home_layout.events =  {

	'click .tags-list-inline span' : function(event) {
		var target = $(event.target);
		var tag_name = target.html();
		var tag_slug = tag_name.toLowerCase().replace(' ', '-');

		Router.go('tag_display', {tag_slug: tag_slug});

	}

}

Template.tag_display.events =  {

	'click .tags-list-inline span' : function(event) {
		var target = $(event.target);
		var tag_name = target.html();
		var tag_slug = tag_name.toLowerCase().replace(' ', '-');

		Router.go('tag_display', {tag_slug: tag_slug});

	}

}

Template.display_question.events = {

	'click .tags-list-inline span' : function(event) {
		var target = $(event.target);
		var tag_name = target.html();
		var tag_slug = tag_name.toLowerCase().replace(' ', '-');

		Router.go('tag_display', {tag_slug: tag_slug});

	}	
}


Template.tag_display.rendered = function() {
	$('.tag-title span').tooltip();
	NProgress.start();
}


