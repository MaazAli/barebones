Meteor.methods({
	create_answer: function(question_id, answer_content, user_id, username, users_voted) {

			var answer_points = 5;
			var current_question = Questions.findOne({_id:question_id});
			var all_tags = current_question.tags;
			console.log(all_tags);

			var newID = Answers.insert({
				question_id: question_id,
				content: answer_content,
				user_id: user_id,
				username: username,
				created_timestamp: Date.now(),
				updated_timestamp: 0,
				answer_state: "Visible",
				comment_count: 0,
				vote_score: 0,
				users_voted: users_voted
			});

			// Update the user statistics
			Meteor.call('increment_answer_count_user', function(error, result) {
				console.log(result);
				console.log(error);
			});

			for (var i = 0; i < all_tags.length; i++) {
				// Update influence points
				Meteor.call('increment_influence_points_user_per_tag', answer_points, all_tags[i], function(error, result) {
					console.log(result);
					console.log(error);
				});
			}

			// Update the question with the answer count 
			Meteor.call('increment_answer_count_question', question_id, function(error, result) {
				console.log(result);
				console.log(error);
			});

			return newID;
	},
	increment_comment_count_answer: function (id) {
		Answers.update({_id: id}, {$inc: {comment_count: 1}});
	},
	update_vote_count_answer: function(user_id, increment_by, answer_id) {
		// increment_by could be a negative amount.
		// Returns false on failure and true on success.


		var answer = Answers.findOne({_id: answer_id});
		var users_voted = answer.users_voted;
		var check = users_voted.map(function(e) { return e.user_id; }).indexOf(user_id);
		increment_by = parseInt(increment_by);
		console.log(check);

		if (check == -1) {

			Answers.update({_id: answer_id}, {$inc: {vote_score: increment_by}});
			
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
			Answers.update({_id: answer_id}, {$push: {users_voted: user_object}});
			return "added";

		} else if (check != -1) {

			var u_object = users_voted[check];

			if (increment_by == 1 && u_object.score == "down") {

				u_object.score = "up";
				Answers.update({_id: answer_id}, {$inc: {vote_score: 2}}); // Going from negative rating to positive. So remove the negative, and add a positive = 2 :)
				var object_container = {};
				object_container["users_voted." + check] = u_object;
				Answers.update({_id: answer_id}, {$set: object_container});

				return "switched";

			} else if (increment_by == -1 && u_object.score == "up") {

				u_object.score = "down";
				Answers.update({_id: answer_id}, {$inc: {vote_score: -2}}); // Going from positive to negative. Remove the positive, then add a negative = -2 :D
				var object_container = {};
				object_container["users_voted." + check] = u_object;
				Answers.update({_id: answer_id}, {$set: object_container});

				return "switched";

			} else if (increment_by == 1 && u_object.score == "up") {
				Answers.update({_id: answer_id}, {$inc: {vote_score: -1}});
				Answers.update({_id: answer_id}, {$pull: {users_voted: u_object}});
				return "removed";
			} else if (increment_by == -1 && u_object.score == "down") {
				Answers.update({_id: answer_id}, {$inc: {vote_score: 1}});
				Answers.update({_id: answer_id}, {$pull: {users_voted: u_object}});	
				return "removed";			
			} else {
				return "not updated";
			}
		}

	}

});

