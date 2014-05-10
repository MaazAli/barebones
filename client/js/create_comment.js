Template.comment_submission_form.events = {
	'keypress .comment-submission-input' : function(event) { 

		//console.log('test');
		var min_comment_char = 10;
		var max_comment_char = 500;
		var content_element = $(event.target);
		var content = content_element.val().trim();
		var char_indicator = $(content_element).parent().find('.comment-char-counter');

		if (content.length < min_comment_char) {
			char_left = min_comment_char - content.length;
			char_indicator.html(char_left + ' more to go'); 
		} else if (content.length <= max_comment_char) {
			char_left = max_comment_char - content.length;
			char_indicator.html(char_left + ' characters left');
		} else {
			char_left = content.length - max_comment_char;
			char_indicator.html('Remove ' + char_left + ' characters');
		}
		console.log(event.keyCode);
		if (event.keyCode == 13 && !event.shiftKey) { // When the enter key is pressed 
			console.log('test');
			event.preventDefault();
			var content_id = $(content_element).parent().find('.comment_content_id').val();
			var content_type = $(content_element).parents('.comment-list').find('.content-type-indicator').val();

			// User related
			var user_object = Meteor.user()
			var username = user_object.username;
			var user_id = user_object._id;

			if (user_object == null) {
				console.log('Please sign in');
			} else if (content.length < min_comment_char ) {
				//alert('You need at least ' + min_comment_char + ' characters.');
			} else if (content.length > max_comment_char) {
				//alert('Keep comments short, make it less than ' + max_comment_char + ' characters.');
			} else if(content_id) {

						// Reset the comment box
						content_element.val('');

				Meteor.call('create_comment', content_type, content_id, content, user_id, username, function(error, results) {
					//console.log('create_comment error' + error);
					//console.log('create_comment result' + result);

					if (error) {

					} else {

						console.log('Your comment has been posted above!');
						content_element.focus();

					}
				});

			}
		}

	}
}