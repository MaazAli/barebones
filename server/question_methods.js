Meteor.methods({
	create_question: function(question_title, slug, question_content, user_id, username, tags_array, users_voted) {

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


	}

});

