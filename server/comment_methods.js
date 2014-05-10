Meteor.methods({
	create_comment: function(content_type, content_id, content, user_id, username) {

			var current_content_types = ["answer", "question", "profile-post"];
			var min_comment_char = 10;
			var max_comment_char = 500;
			content = content.trim();

			// If it's some random content type that bearbones does not support
			if (current_content_types.indexOf(content_type) == -1) {
				return null;
			}

			// Various checks

			if (Meteor.userId() != user_id) {
				new Meteor.Error('403', 'User ID does not match.');
				return null;
			}

			if (Meteor.user().username != username) {
				new Meteor.Error('403', 'User name does not match.');
				return null;
			}

			var content_check = {};

			if (content_type == "answer") {
				content_check = Answers.findOne({_id: content_id});
			} else if (content_type == "question") {
				content_check = Questions.findOne({_id: content_id});
			} else if (content_type == "profile-post") {
				content_check = Profile_posts.findOne({_id: content_id});
			}

			if (content_check == null || content_check == undefined || content_check == {}) {
				return null;
			}

			if (content < min_comment_char || content > max_comment_char) {
				return null;
			} 


			// if control got to here, it means everything has been verified.

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
					users_voted: []
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

