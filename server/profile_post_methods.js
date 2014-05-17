Meteor.methods({
	create_profile_post: function(profile_username, profile_user_id, username, user_id, profile_post) {

		var max_profile_post_length = 140;

		if (Meteor.userId() != user_id) {
			new Meteor.Error('403', 'User ID does not match.');
			return null;
		}

		if (Meteor.user().username != username) {
			new Meteor.Error('403', 'User name does not match.');
			return null;
		}

		var user_profile = Meteor.users.findOne({_id: profile_user_id});

		if (user_profile == null || user_profile == undefined || user_profile == {}) {
			return null;
		}

		if (profile_post > max_profile_post_length) {
			return null;
		}

		// If we got to this point, then all the conditions above were met.

		var newID = Profile_posts.insert({
			profile_username: user_profile.username,
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


		if (user_id != Meteor.userId()) {
			// Someone is trying to spoof...
			// Assumption: Only the current user can like content
			return;
		}

		var profile_post = Profile_posts.findOne({_id: profile_post_id});
		if (profile_post.users_liked.indexOf(user_id) > -1) {
			Profile_posts.update({_id: profile_post_id}, {$pull: {users_liked: user_id}, $inc: {like_count: -1}});
			return "unliked";			
		} else if (profile_post.users_liked.indexOf(user_id) == -1) {
			Profile_posts.update({_id: profile_post_id}, {$push: {users_liked: user_id}, $inc : {like_count: 1}});
			

			// Send an alert to the user that got liked
			Meteor.call('create_alert', profile_post.user_id, user_id, Meteor.user().username, "profile_post", profile_post_id, "like");


			return "liked";

		}

	}
});