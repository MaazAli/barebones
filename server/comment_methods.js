Meteor.methods({
	create_comment: function(content_type, content_id, content, user_id, username, users_voted) {

			var newID = Comments.insert({
					content_type: content_type,
					content_id: content_id,
					content: content,
					user_id: user_id,
					username: username,
					created_timestamp: Date.now(),
					updated_timestamp: 0,
					comment_state: "Visible",
					vote_score: 0,
					users_voted: users_voted
			});
			
			// Update comment count in user.
			Meteor.call('increment_comment_count_user', function(error, result) {
				console.log(result);
				console.log(error);
			});

			// Update content's comment count

			if (content_type == "answer") {
				Meteor.call('increment_comment_count_answer', content_id, function(error, result) {
					console.log(result);
					console.log(error);
				});
			} else if (content_type == "question") {
				Meteor.call('increment_comment_count_question', content_id, function(error, result) {
					console.log(result);
					console.log(error);
				});				
			} else if (content_type == "profile-post") {
				// Not implemented yet
			}


			return newID;
	}
});

