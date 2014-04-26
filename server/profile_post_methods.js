Meteor.methods({
	create_profile_post: function(profile_username, profile_user_id, username, user_id, profile_post) {
		var newID = Profile_posts.insert({
			profile_username: profile_username,
			profile_user_id: profile_user_id,
			username: username,
			user_id: user_id,
			profile_post_content: profile_post,
			profile_post_state: "Visible",
			comment_count: 0,
			created_timestamp: Date.now()

		});

		return newID;
	}
});