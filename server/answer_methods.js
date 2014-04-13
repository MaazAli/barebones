Meteor.methods({
	create_answer: function(question_id, answer_content, user_id, username, users_voted) {

			var answer_points = 2;

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

			// Update influence points, 2 per answer
			Meteor.call('increment_influence_points_user', answer_points, function(error, result) {
				console.log(result);
				console.log(error);
			});

			// Update the question with the answer count 
			Meteor.call('increment_answer_count_question', question_id, function(error, result) {
				console.log(result);
				console.log(error);
			});

			return newID;
	},
	increment_comment_count_answer: function (id) {
		Answers.update({_id: id}, {$inc: {comment_count: 1}});
	}

});

