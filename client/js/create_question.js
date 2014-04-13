Template.create_question.rendered = function() {
	$('#tag_input').tagsInput({
		'minChars' : 1,
		'maxChars' : 25,
		'onAddTag' : function(tag_name) {
			var tag_slug = tag_name.toLowerCase().replace(' ', '-');
			var find = Tags.findOne({tag_slug: tag_slug});
			if (find) {
				console.log('Tag exists');
				if (find.tag_name != tag_name) {
					$('#tag_input').removeTag(tag_name);
					$('#tag_input').addTag(find.tag_name);
					$('#tag_input_tag').focus();
				}

			} else {
				console.log('Tag does not exist!');
				$('#tag_input').removeTag(tag_name);
				$('#tag_input_tag').focus();
				// Add user notification that tag does not exist.
			}
		}
	});
};

Template.create_question.events = {

	// For the title :)
	'keypress #question_title_input' : function(event) {
		question_title = $('#question_title_input').val();

		if (question_title) {
			$('.title_preview').html('Ask Question: <span>' + question_title + '</span>');
		} else {
			$('.title_preview').html('Ask Question');
		}
	},


	// For previewing the output
	'keypress #question_content' : function(event) {
		var content = $('#question_content').val();
		$('#preview_output').html(content);
	},

	'click #post_question_button' : function(event) {

		event.preventDefault();

		var min_title_length = 5;
		var max_title_length = 75;

		var min_question_content_length = 100;

		var question_title = $('#question_title_input').val();
		var slug = question_title.replace(/[^a-zA-Z0-9\s]/g,"");
		slug = slug.toLowerCase();
		slug = slug.replace(/\s/g,'-');
		slug = slug.replace(/^-*|-*$|(-)-*/g, "$1");
		var question_content = $('#question_content').val();
		var tags_input = $('#tag_input').val();

		console.log(tags_input);

		var user_object = Meteor.user();
		var username = user_object.username;
		var user_id = user_object._id;

		var users_voted = [];

		console.log(tags_array);

		if (question_title.length < min_title_length || question_title.length > max_title_length) {
			alert('Your title\'s length must be between ' + min_title_length + ' and ' + max_title_length + ' characters.');
		} else if (question_content == '') {
			alert('Please be more discriptive, you need to have at least ' + min_question_content_length + ' characters in your question description.');
		} else if (user_id == null) {
			alert('You\'re not logged in');
		} else if( tags_input.length == 0 ) {
			alert('You need at least one approved tag.');
		} else {

			var tags_array = tags_input.split(',');

			Meteor.call('create_question', question_title, slug, question_content, user_id, username, tags_array, users_voted, function(error, result) {
				console.log('create_question error ' + error);
				console.log('create_question result ' + result);

				if (error) {

				} else {
					console.log('Your question was submitted');
					Router.go('question_display', {_id: result});
				}
			});		

		}


	}
};