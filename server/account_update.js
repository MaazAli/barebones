Meteor.methods({
	increment_question_count_user: function () {
		Meteor.users.update({_id: this.userId}, {$inc: {question_count: 1}});
	},
	increment_answer_count_user: function() {
		Meteor.users.update({_id: this.userId}, {$inc: {answer_count: 1}});
	},
	increment_comment_count_user: function() {
		Meteor.users.update({_id: this.userId}, {$inc: {comment_count: 1}});
	},
	increment_influence_points_user_per_tag: function(amount, tag) {
		var user = Meteor.users.findOne({_id:this.userId});
		if (tag in user.influence) {
			updated_points = user.influence[tag].influence_points + amount;
			user.influence[tag].influence_points = updated_points;
			current_level = user.influence[tag].level;

			while (updated_points >= (current_level*current_level - current_level + 6)) {
				current_level++;
				Meteor.users.update({_id: this.userId}, {$inc: {level_count: 1}});
			}

			user.influence[tag].level = current_level;
		} else {
			user.influence[tag] = {influence_points: amount, level: 1};
			Meteor.users.update({_id: this.userId}, {$inc: {level_count: 1}});
		}
		var new_object = {};
		new_object["influence"] = user.influence;

		Meteor.users.update({_id: this.userId}, {$set: new_object});
	},
	profile_follow: function(follower_id, followee_id) {

		if (follower_id != Meteor.userId()) {
			return null;
		}

		Meteor.users.update({_id: followee_id}, {$inc: {follower_count: 1}});
		Meteor.users.update({_id: follower_id}, {$inc: {following_count: 1}});

		Meteor.users.update({_id: followee_id}, {$push: {followers: follower_id}});
		Meteor.users.update({_id: follower_id}, {$push: {following: followee_id}});

		Meteor.call('create_alert', followee_id, follower_id, Meteor.user().username, "user", followee_id, "follow");
	},
	profile_unfollow: function(follower_id, followee_id) {
		Meteor.users.update({_id: followee_id}, {$inc: {follower_count: -1}});
		Meteor.users.update({_id: follower_id}, {$inc: {following_count: -1}});

		Meteor.users.update({_id: followee_id}, {$pull: {followers: follower_id}});
		Meteor.users.update({_id: follower_id}, {$pull: {following: followee_id}});		
	},
	user_avatar_changer: function(user_id, img_url, height, width) {
		var avatar_object = {};
		avatar_object.url = img_url;
		avatar_object.height = height;
		avatar_object.width = width;
		Meteor.users.update({_id: user_id}, {$set: {"profile.avatar": avatar_object}});
	},
	profile_cover_changer: function(user_id, img_url, height, width) {
		var cover_object = {};
		cover_object.url = img_url;
		cover_object.height = height;
		cover_object.width = width;
		Meteor.users.update({_id: user_id}, {$set: {"profile.profile_cover": cover_object}});
	},
	update_status_message: function(user_id, user_status_message) {
		Meteor.users.update({_id: user_id}, {$set: {"profile.status_message": user_status_message}});
	}
});

