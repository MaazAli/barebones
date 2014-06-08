Template.create_question.rendered = function() {

	var site_name = "barebones";
	document.title = "Ask Question | " + site_name;

	$('#tag_input').tokenInput("/autocomplete/tags", {
            	theme: "facebook",
            	propertyToSearch: "tag_name",
            	tokenLimit: 5,
            	preventDuplicates: true,
	            onAdd: function(item) {
					var min_title_length = 5;
					var max_title_length = 75;
					var min_question_content_length = 100;
					var question_title = $('#question_title_input').val();
					var question_content = $('#question_content').val();
					var tags = $('#tag_input').tokenInput("get");
					disable_question_submit(question_title, question_content, min_title_length, max_title_length, min_question_content_length, tags);            		
            	},
            });

	// $('#tag_input').val('');
	// $('#tag_input').tagsInput({
	// 	'minChars' : 1,
	// 	'maxChars' : 25,
	// 	'onAddTag' : function(tag_name) {
	// 		var tag_slug = tag_name.toLowerCase().replace(' ', '-');
	// 		var find = Tags.findOne({tag_slug: tag_slug});
	// 		if (find) {
	// 			console.log('Tag exists');
	// 			if (find.tag_name != tag_name) {
	// 				$('#tag_input').removeTag(tag_name);
	// 				$('#tag_input').addTag(find.tag_name);
	// 				$('#tag_input_tag').focus();
	// 			}

	// 		} else {
	// 			console.log('Tag does not exist!');
	// 			$('#tag_input').removeTag(tag_name);
	// 			$('#tag_input_tag').focus();
	// 			// Add user notification that tag does not exist.
	// 		}
	// 		var min_title_length = 5;
	// 		var max_title_length = 75;
	// 		var min_question_content_length = 100;
	// 		var question_title = $('#question_title_input').val();
	// 		var question_content = $('#question_content').val();
	// 		var tags = $('#tag_input').val().trim();

	// 		disable_question_submit(question_title, question_content, min_title_length, max_title_length, min_question_content_length, tags);
	// 	},
	// 	'onRemoveTag' : function(tag_name) {
	// 		var min_title_length = 5;
	// 		var max_title_length = 75;
	// 		var min_question_content_length = 100;
	// 		var question_title = $('#question_title_input').val();
	// 		var question_content = $('#question_content').val();
	// 		var tags = $('#tag_input').val().trim();

	// 		disable_question_submit(question_title, question_content, min_title_length, max_title_length, min_question_content_length, tags);			
	// 	}
	// });

	$('#post_question_button').prop('disabled', true);


};

var disable_question_submit = function(question_title, question_content, min_title, max_title, min_content, tags) {

		// For Question Title
		if (question_title.length < min_title) {
			$('#char_indicator_title').html("Title: " + (min_title - question_title.length) + " to go");
		} else if ((max_title - question_title.length) <= 10 && (max_title - question_title.length) > 0) {
			$('#char_indicator_title').html("Title: " + (max_title - question_title.length) + " characters left");
		} else if ((max_title - question_title.length) < 0) {
			$('#char_indicator_title').html("Title: Remove " + (question_title.length - max_title) + " characters");
		} else {
			$('#char_indicator_title').html("");
		}

		// For question_content
		if (question_content.length < min_content) {
			$('#char_indicator_content').html("Content: " + (min_content - question_content.length) + " to go");
		} else {
			$('#char_indicator_content').html('');
		}

		// For tag 

		if (tags.length > 0) {
			$('#indicator_tag').html('');
		}

		// Check

		if (question_title.length < min_title || question_title.length > max_title || question_content.length < min_content || tags.length == 0) {
			$('#post_question_button').prop('disabled', true);
		} else {
			$('#post_question_button').prop('disabled', false);
		}

}

Template.create_question.events = {

	// For the title :)
	'keyup, keypress, blur #question_title_input' : function(event) {
		question_title = $('#question_title_input').val();

		if (question_title) {
			$('.title_preview').html('Ask Question: <span style="word-wrap: break-word">' + question_title + '</span>');
		} else {
			$('.title_preview').html('Ask Question');
		}

		var min_title_length = 5;
		var max_title_length = 75;
		var min_question_content_length = 100;
		var question_title = $('#question_title_input').val().trim();
		var question_content = $('#question_content').val().trim();
		var tags = $('#tag_input').tokenInput("get");

		console.log(tags);
		disable_question_submit(question_title, question_content, min_title_length, max_title_length, min_question_content_length, tags);

	},


	// For previewing the output
	'keyup, keypress, blur #question_content' : function(event) {
		var content = $('#question_content').val().trim();

		var min_title_length = 5;
		var max_title_length = 75;
		var min_question_content_length = 100;
		var question_title = $('#question_title_input').val().trim();
		var question_content = $('#question_content').val().trim();
		var tags = $('#tag_input').tokenInput("get");

		disable_question_submit(question_title, question_content, min_title_length, max_title_length, min_question_content_length, tags);
		Session.set("question_content", question_content);

	},

	'click #post_question_button' : function(event) {

		event.preventDefault();

		var min_title_length = 5;
		var max_title_length = 75;

		var min_question_content_length = 100;

		var question_title = $('#question_title_input').val().trim();
		var question_content = $('#question_content').val().trim();
		var tags_input = $('#tag_input').tokenInput("get");
		var tags_array = [];

		// creating the right tags_array structure
		for (var i = 0; i < tags_input.length; i++) {
			tags_array.push(tags_input[i].tag_name);
		}

		console.log(tags_array);

		var user_object = Meteor.user();
		var username = user_object.username;
		var user_id = user_object._id;

		var users_voted = [];


		if (question_title.length < min_title_length || question_title.length > max_title_length) {
			alert('Your title\'s length must be between ' + min_title_length + ' and ' + max_title_length + ' characters.');
		} else if (question_content == '') {
			alert('Please be more discriptive, you need to have at least ' + min_question_content_length + ' characters in your question description.');
		} else if (user_id == null) {
			alert('You\'re not logged in');
		} else if( tags_input.length == 0 ) {
			alert('You need at least one approved tag.');
		} else {

			Meteor.call('create_question', question_title, question_content, user_id, username, tags_array, users_voted, function(error, result) {
				console.log('create_question error ' + error);
				console.log('create_question result ' + result);

				if (error) {

				} else if (result != null) {
					console.log('Your question was submitted');
					Router.go('question_display', {_id: result});
				}
			});		

		}


	}
};

Template.create_question.question_content = function() {
	return Session.get("question_content");
} 