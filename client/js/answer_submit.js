Template.answer_submission_form.events = {
	'click #post_answer_button' : function(event) {
		var min_answer_content = 20;
		var answer_content = $('#answer_content_form').val().trim();
		var question_id = this._id;
		var answer_points = 2;
		// User related
		var user_object = Meteor.user()
		var username = user_object.username;
		var user_id = user_object._id;

		if (answer_content.length < min_answer_content) {
			alert('Please have at least ' + min_answer_content + ' characters in your answer.');
		} else if (user_object == null) {
			alert('You\'re not logged in');
		} else {

			Meteor.call('create_answer', question_id, answer_content, user_id, username, function(error, results) {

				if (error) {
					console.log('create_answer error ' + error);
					console.log('create_answer result ' + result);
				} else if (result != null) {
					console.log('Your answer has beenhis posted above!');
				} else {
					console.log('Something went wrong!');
				}
			});


		}

	},

	'keypress, keyup, blur #answer_content_form' : function(event) {
		var min_answer_content = 20;
		var answer_content = $('#answer_content_form').val().trim();

		if (answer_content.length < min_answer_content) {
			$('#post_answer_button').prop('disabled', true);
			$('.char-indicator').html(min_answer_content - answer_content.length + " to go")
		} else {
			$('#post_answer_button').prop('disabled', false);
			$('.char-indicator').html('');
		}
	}
}

Template.answer_submission_form.rendered = function() {
	$('#post_answer_button').prop('disabled', true);
}


Template.display_question.events({
	'click .best-answer-handler' : function(event) {
		var answer_id = this._id;
		var question_id = this.question_id;

		Meteor.call('update_best_answer', question_id, answer_id, function(error, result) {
			if (!error) {
				if (result == "added") {
					$('.best-answer-handler').removeClass('best-answer-selected');
					$('.best-answer-display-pre').removeClass('best-answer-display');
					$('#best_answer_handler_' + answer_id).addClass('best-answer-selected');
					$('#best_answer_display_' + answer_id).addClass('best-answer-display');
				} else if (result == "removed") {
					$('#best_answer_handler_' + answer_id).removeClass('best-answer-selected');
					$('#best_answer_display_' + answer_id).removeClass('best-answer-display');
				}
			}
		});

	}
});

Template.display_question.is_user_asker = function(question_user_id) {
	return (question_user_id == Meteor.userId()); 
}



var update_post_thumbs = function(id) {
	var element_up = $('.post-action-bar').find("[data-content-id='" + id + "'][data-increment='1']" );;
	var element_down = $('.post-action-bar').find("[data-content-id='" + id + "'][data-increment='-1']" );

	// if( ReactiveCookie.get('content_voted_user') ) {
	// 	var voted_content = JSON.parse(ReactiveCookie.get('content_voted_user'));

	// 	console.log(voted_content);
	// 	if (id in voted_content) {

	// 		if (voted_content.hasOwnProperty(id)) {
	// 				var check_up = element_up.hasClass('thumbs-up');
	// 				var check_down = element_down.hasClass('thumbs-down');

	// 				// console.log("Check up: " + check_up);
	// 				// console.log("Check down: " + check_down);
					
	// 			if (voted_content[id] == "up") {
	// 				element_up.addClass('thumbs-up');
	// 				element_down.removeClass('thumbs-down');
	// 			} else if (voted_content[id] == "down") {
	// 				element_down.addClass('thumbs-down');
	// 				element_up.removeClass('thumbs-up');
	// 			}
	// 		}
	// 	}
	// 	console.log(voted_content[id]);
	// 	if(!(id in voted_content) && id != undefined) {
	// 		element_down.removeClass('thumbs-down');
	// 		element_up.removeClass('thumbs-up');
	// 	}

	// } else {


		// In this case we could have to go and query every post
		// to check if the user voted on it. Too intensive, leaving
		// it out for now. Will look for an alternative when cookies
		// are removed.
		//console.log("Update Thumbs called!");
		var current_user_id = Meteor.userId();
		if (current_user_id) {
			if (element_up.parents('.question-wrapper').length) {
				var current_question = Questions.findOne({_id: id});
				var possible_score_array = $.grep(current_question.users_voted, function(e){ return e.user_id == current_user_id; });
				if (possible_score_array.length == 1) {
					var score = possible_score_array[0].score;

					if (score == "up") {
						console.log('Score is: ' + score);
						element_up.addClass('thumbs-up');
						element_down.removeClass('thumbs-down');						
					} else {
						element_down.addClass('thumbs-down');
						element_up.removeClass('thumbs-up');						
					}
				} else {
					// Not found, so remove any thumb classes if there were any...
					element_up.removeClass('thumbs-up');
					element_down.removeClass('thumbs-down');
				}

			} else if (element_up.parents('.answer-wrapper').length) {
				var current_answer = Answers.findOne({_id: id});
				var possible_score_array = $.grep(current_answer.users_voted, function(e){ return e.user_id == current_user_id; });
				if (possible_score_array.length == 1) {
					var score = possible_score_array[0].score;

					if (score == "up") {
						element_up.addClass('thumbs-up');
						element_down.removeClass('thumbs-down');						
					} else {
						element_down.addClass('thumbs-down');
						element_up.removeClass('thumbs-up');						
					}
				} else {
					// Not found, so remove any thumb classes if there were any...
					element_up.removeClass('thumbs-up');
					element_down.removeClass('thumbs-down');
				}
			}
		}
	// }	
};


Template.post_action_bar.events = {

	'click .post-thumbs' : function(event) {

		var element = $(event.target);
		var increment_by = element.attr('data-increment');

		// console.log(element);
		// console.log(increment_by);

		var content_id = element.attr('data-content-id');
		var user_id = Meteor.userId();

		console.log(content_id);

		if (element.parents('.question-wrapper').length) {

			Meteor.call('update_vote_count_question', user_id, increment_by, content_id, function(error, results) {

				if (error) {
					console.log('Something went wrong :(');
				} else {

					if (results != "not updated") {
						// if (ReactiveCookie.get('content_voted_user')) {
						// 	var cookie_object = JSON.parse(ReactiveCookie.get('content_voted_user'));
						// } else {
						// 	cookie_object = {};
						// }
						
						// if (content_id in cookie_object && results == "switched") {

						// 	if(cookie_object[content_id] == "up") {
						// 		cookie_object[content_id] = "down";
						// 	} else {
						// 		cookie_object[content_id] = "up";
						// 	}
							
						// } else if (content_id in cookie_object && results == "removed") {

						// 	delete cookie_object[content_id];

						// } else if (results == "added") {

						// 	if (increment_by == 1) {
						// 		cookie_object[content_id] = "up";
						// 	} else {
						// 		cookie_object[content_id] = "down";
						// 	}

						// }


						// ReactiveCookie.set('content_voted_user', JSON.stringify(cookie_object), {days: 365});
						update_post_thumbs(content_id);
					}

				}
			});

		} else if (element.parents('.answer-wrapper').length) {
			

			Meteor.call('update_vote_count_answer', user_id, increment_by, content_id, function(error, results) {

				if (error) {
					console.log('Something went wrong :(');
				} else {

					if (results != "not updated") {
						// if (ReactiveCookie.get('content_voted_user')) {
						// 	var cookie_object = JSON.parse(ReactiveCookie.get('content_voted_user'));
						// } else {
						// 	cookie_object = {};
						// }
						// if (content_id in cookie_object && results == "switched") {

						// 	if(cookie_object[content_id] == "up") {
						// 		cookie_object[content_id] = "down";
						// 	} else {
						// 		cookie_object[content_id] = "up";
						// 	}
							
						// } else if (content_id in cookie_object && results == "removed") {

						// 	delete cookie_object[content_id];

						// } else if (results == "added") {

						// 	if (increment_by == 1) {
						// 		cookie_object[content_id] = "up";
						// 	} else {
						// 		cookie_object[content_id] = "down";
						// 	}

						// }


						// ReactiveCookie.set('content_voted_user', JSON.stringify(cookie_object), {days: 365});
						update_post_thumbs(content_id);
					}

				}
			});


		}





	},
	'click .post-add-comment' : function(event) {
		$('#comment_input_' + this._id).focus();
	}

}

Template.post_action_bar.rendered = function() {

	console.log(this.data._id);
	update_post_thumbs(this.data._id);
	
}


Template.display_question.answer = function() {

	return Answers.find({question_id: this._id}, {sort: {created_timestamp: 1}});

}

Template.display_question.comment = function() {
	return Comments.find({content_id: this._id}, {sort: {created_timestamp: 1}});
}

Template.display_question.alreadyAnswered = function() {
	var answer = Answers.findOne({question_id: this._id, user_id: Meteor.userId()});

	if (answer) {
		return true;
	} else {
		return false;
	}
}



Template.display_question.rendered = function() {
	// For best answer 
	var question = Questions.findOne({_id: this.data._id});

	if (question.best_answer != '') {
		$('.best-answer-handler').removeClass('best-answer-selected');
		$('.best-answer-display-pre').removeClass('best-answer-display');
		$('#best_answer_handler_' + question.best_answer).addClass('best-answer-selected');
		$('#best_answer_display_' + question.best_answer).addClass('best-answer-display');		
	}

	var site_title = "bearbones";

	document.title = question.tags[0] + " - " + question.title + " | " + site_title;

}