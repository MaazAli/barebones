Template.answer_submission_form.events = {
	'click #post_answer_button' : function(event) {
		var min_answer_content = 20;
		var answer_content = $('#answer_content_form').val();
		var question_id = this._id;
		var answer_points = 2;
		// User related
		var user_object = Meteor.user()
		var username = user_object.username;
		var user_id = user_object._id;
		var users_voted = [];

		if (answer_content.length < min_answer_content) {
			alert('Please have at least ' + min_answer_content + ' characters in your answer.')
		} else if (user_object == null) {
			alert('You\'re not logged in');
		} else {

			Meteor.call('create_answer', question_id, answer_content, user_id, username, users_voted, function(error, results) {

				if (error) {
					console.log('create_answer error ' + error);
					console.log('create_answer result ' + result);
				} else {
					console.log('Your answer has been posted above!');
				}
			});


		}

	}
}

// Template.comment_submission_form.events = {

// 	'change .comment-submission-input' : function(event) {
// 		console.log('test');
// 		var min_comment_char = 20;
// 		var max_comment_char = 500;
// 		var content_element = $(event.target);
// 		var content = content_element.val().trim();
// 		var char_indicator = $(content_element).parent().find('.comment-char-counter');

// 		if (content.length < min_comment_char) {
// 			char_left = min_comment_char - content.length;
// 			char_indicator.html(char_left + ' more to go'); 
// 		} else if (content.length <= max_comment_char) {
// 			char_left = max_comment_char - content.length;
// 			char_indicator.html(char_left + ' characters left');
// 		} else {
// 			char_left = content.length - max_comment_char;
// 			char_indicator.html('Remove ' + char_left + ' characters');
// 		}

// 		if (event.keyCode == 13 && !event.shiftKey) { // When the enter key is pressed 
			
// 			event.preventDefault();
// 			var content_id = $(content_element).parent().find('.comment_content_id').val();
// 			var content_type = $(content_element).parents('.comment-list').find('.content-type-indicator').val();

// 			// User related
// 			var user_object = Meteor.user()
// 			var username = user_object.username;
// 			var user_id = user_object._id;
// 			var users_voted = [];

// 			if (content.length < 20 ) {
// 				//alert('You need at least ' + min_comment_char + ' characters.');
// 			} else if (content.length > 500) {
// 				//alert('Keep comments short, make it less than ' + max_comment_char + ' characters.');
// 			} else if(content_id) {

// 						// Reset the comment box
// 						content_element.val('');

// 				Meteor.call('create_comment', content_type, content_id, content, user_id, username, users_voted, function(error, results) {
// 					//console.log('create_comment error' + error);
// 					//console.log('create_comment result' + result);

// 					if (error) {

// 					} else {

// 						console.log('Your comment has been posted above!');
// 						content_element.focus();

// 					}
// 				});

// 				content_element.focus();

// 			}
// 		}
// 	}
// }

var update_post_thumbs = function() {
	console.log(this.data._id);
	if( ReactiveCookie.get('content_voted_user') ) {
		var voted_content = JSON.parse(ReactiveCookie.get('content_voted_user'));

		for (var id in voted_content) {
			if (voted_content.hasOwnProperty(id)) {

				if (voted_content[id] == "up") {
					var element = $('.post-action-bar').find("[data-content-id='" + id + "'][data-increment='1']" );
					element.addClass('thumbs-up');
				} else if (voted_content[id] == "down") {
					var element = $('.post-action-bar').find("[data-content-id='" + id + "'][data-increment='-1']" );
					element.addClass('thumbs-down');
				}
			}
		}

	} else {

		// In this case we could have to go and query every post
		// to check if the user voted on it. Too intensive, leaving
		// it out for now. Will look for an alternative when cookies
		// are removed.

	}	
};


Template.post_action_bar.events = {

	'click .post-thumbs' : function(event) {

		var element = $(event.target);
		var increment_by = element.attr('data-increment');

		// console.log(element);
		// console.log(increment_by);

		var question_id = element.attr('data-content-id');
		var user_id = Meteor.userId();

		console.log(question_id);

		if (element.parents('.question-wrapper').length) {

			Meteor.call('update_vote_count_question', user_id, increment_by, question_id, function(error, results) {

				if (error) {
					console.log('Something went wrong :(');
				} else {

					if (results != "not updated") {
						if (ReactiveCookie.get('content_voted_user')) {
							var cookie_object = JSON.parse(ReactiveCookie.get('content_voted_user'));
						} else {
							cookie_object = {};
						}
						if (question_id in cookie_object && results == "switched") {

							if(cookie_object[question_id] == "up") {
								cookie_object[question_id] = "down";
							} else {
								cookie_object[question_id] = "up";
							}
							
						} else if (question_id in cookie_object && results == "removed") {

							delete cookie_object[question_id];

						} else if (results == "added") {

							if (increment_by == 1) {
								cookie_object[question_id] = "up";
							} else {
								cookie_object[question_id] = "down";
							}

						}


						ReactiveCookie.set('content_voted_user', JSON.stringify(cookie_object), {days: 365});
						update_post_thumbs();
					}

				}
			});

		} else if (element.parents('.answer-wrapper').length) {
			console.log('Answer');
		}





	}

}

Template.post_action_bar.rendered = function() {

	update_post_thumbs();
	
};



Template.display_question.answer = function() {

	return Answers.find({question_id: this._id}, {sort: {created_timestamp: 1}});

};

Template.display_question.comment = function() {
	return Comments.find({content_id: this._id}, {sort: {created_timestamp: 1}});
};

Template.display_question.alreadyAnswered = function() {
	var answer = Answers.findOne({question_id: this._id, user_id: Meteor.userId()});

	if (answer) {
		return true;
	} else {
		return false;
	}
};



Template.display_question.rendered = function() {

	var site_title = "bearbones";

	console.log(this);

	//document.title = 

}