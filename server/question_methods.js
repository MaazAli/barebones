Meteor.methods({
	create_question: function(question_title, question_content, user_id, username, tags_array, users_voted) {

			// Various checks

			if (Meteor.userId() != user_id) {
				new Meteor.Error('403', 'User ID does not match.');
				return null;
			}

			if (Meteor.user().username != username) {
				new Meteor.Error('403', 'User name does not match.');
				return null;
			}

			// Generic redundant checks that are necessary
			var min_title_length = 5;
			var max_title_length = 75;

			var min_question_content_length = 100;

			question_title = question_title.trim();
			question_content = question_content.trim();
			var slug = question_title.replace(/[^a-zA-Z0-9\s]/g,"");
			slug = slug.toLowerCase();
			slug = slug.replace(/\s/g,'-');
			slug = slug.replace(/^-*|-*$|(-)-*/g, "$1");			

			if (question_title.length < min_title_length || question_title.length > max_title_length) {
				console.log('Question title length issue');
				return null;
			} else if (question_content < min_question_content_length) {
				console.log('Question content length issue');
				return null;
			} else if (user_id == null) {
				consle.log('User ID is null');
				return null;
			} else if ( tags_array.length == 0 ) {
				console.log('Tags Array\'s length is 0');
				return null;
			} else {
				var question_points = 2;

				var newID = Questions.insert({
						title: question_title,
						slug: slug,
						content: question_content,
						user_id: user_id,
						username: username,
						tags: tags_array,
						created_timestamp: Date.now(),
						updated_timestamp: 0,
						question_state: "Visible",
						answer_count: 0,
						view_count: 0,
						question_open: true,
						comment_count: 0,
						vote_score: 0,
						best_answer: '',
						users_voted: users_voted
				});

				// Update user question_count
				Meteor.call('increment_question_count_user', function(error, result) {
					console.log(result);
					console.log(error);
				});

				// Update question_count for tags
				Meteor.call('increment_questions_tagged_tags', tags_array, function(error, result) {
					console.log(result);
					console.log(error);
				});

				// Update Tag's activity timestamps
				Meteor.call('update_activity_timestamps_tags', tags_array, function(error, result) {
					console.log(result);
					console.log(error);
				});

				for (var i = 0; i < tags_array.length; i++) {
					// Update influence points
					Meteor.call('increment_influence_points_user_per_tag', question_points, tags_array[i], function(error, result) {
						console.log(result);
						console.log(error);
					});

				}

				return newID;
			}	
	},
	increment_answer_count_question: function (question_id) {
		Questions.update({_id: question_id}, {$inc : {answer_count: 1}});
	},
	increment_comment_count_question: function (id) {
		Questions.update({_id: id}, {$inc : {comment_count: 1}});
	},
	update_vote_count_question: function(user_id, increment_by, question_id) {

		// increment_by could be a negative amount.
		// Returns false on failure and true on success.

		if (user_id != Meteor.userId()) {
			return "not updated";
		}

		var question = Questions.findOne({_id: question_id});
		var users_voted = question.users_voted;
		var check = users_voted.map(function(e) { return e.user_id; }).indexOf(user_id);
		increment_by = parseInt(increment_by);
		console.log(check);

		if (check == -1) {

			Questions.update({_id: question_id}, {$inc: {vote_score: increment_by}});
			
			user_object = {};

 
			if (increment_by == 1) {
				user_object.user_id = user_id;
				user_object.score = "up";
			} else {
				user_object.user_id = user_id;
				user_object.score = "down";
			}


			console.log(user_object);
			// Add the user's id as well 
			Questions.update({_id: question_id}, {$push: {users_voted: user_object}});

			// We only send an alert when the person initially does something (IN this case upvotes/downvotes)
			Meteor.call('create_alert', question.user_id, user_id, Meteor.user().username, "question", question_id, user_object.score + " vote");

			return "added";

		} else if (check != -1) {

			var u_object = users_voted[check];

			if (increment_by == 1 && u_object.score == "down") {

				u_object.score = "up";
				Questions.update({_id: question_id}, {$inc: {vote_score: 2}});
				var object_container = {};
				object_container["users_voted." + check] = u_object;
				Questions.update({_id: question_id}, {$set: object_container});

				return "switched";

			} else if (increment_by == -1 && u_object.score == "up") {

				u_object.score = "down";
				Questions.update({_id: question_id}, {$inc: {vote_score: -2}});
				var object_container = {};
				object_container["users_voted." + check] = u_object;
				Questions.update({_id: question_id}, {$set: object_container});

				return "switched";

			} else if (increment_by == 1 && u_object.score == "up") {
				Questions.update({_id: question_id}, {$inc: {vote_score: -1}});
				Questions.update({_id: question_id}, {$pull: {users_voted: u_object}});
				return "removed";
			} else if (increment_by == -1 && u_object.score == "down") {
				Questions.update({_id: question_id}, {$inc: {vote_score: 1}});
				Questions.update({_id: question_id}, {$pull: {users_voted: u_object}});	
				return "removed";			
			} else {
				return "not updated";
			}
		}
	},
	update_best_answer: function(question_id, answer_id) {

		var question = Questions.findOne({_id: question_id});
		var answer = Answers.findOne({_id: answer_id});

		if (!answer) {
			return null;
		}

		if (!question) {
			return null;
		}

		// Ensure that the user that created the question is the one that's actually picking the best answer
		if (question.user_id != Meteor.userId()) {
			return null;
		}

		// We remove best answer if it was already selected, and select it if it wasn't.

		if (question.best_answer == answer_id) {
			Questions.update({_id: question_id}, {$set: {best_answer: ''}});
			return "removed";
		} else {
			Questions.update({_id: question_id}, {$set: {best_answer: answer_id}});

			// Create an alert 
			Meteor.call('create_alert', answer.user_id, Meteor.userId(), Meteor.user().username, "answer", answer_id, "best answer");


			return "added";
		}
	}

});

