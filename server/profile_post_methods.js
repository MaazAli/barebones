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
			like_count: 0,
			users_liked: [],
			created_timestamp: Date.now(),
		});

		return newID;
	},
	profile_post_like: function(profile_post_id, user_id) {

		var profile_post = Profile_posts.findOne({_id: profile_post_id});
		if (profile_post.users_liked.indexOf(user_id) > -1) {
			Profile_posts.update({_id: profile_post_id}, {$pull: {users_liked: user_id}});
			Profile_posts.update({_id: profile_post_id}, {$inc: {like_count: -1}});
			return "unliked";			
		} else if (profile_post.users_liked.indexOf(user_id) == -1) {
			Profile_posts.update({_id: profile_post_id}, {$push: {users_liked: user_id}});
			Profile_posts.update({_id: profile_post_id}, {$inc: {like_count: 1}});
			return "liked";
		}

		return "nothing_happened";

	}
});