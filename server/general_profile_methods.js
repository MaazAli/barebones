Meteor.methods({
	profile_follow: function(follower, followee) {
		Meteor.users.update({_id: followee}, {$inc: {follower_count: 1}});
		Meteor.users.update({_id: follower}, {$inc: {following_count: 1}});

		Meteor.users.update({_id: followee}, {$push: {followers: follower}});
		Meteor.users.update({_id: follower}, {$push: {following: followee}});
	},
	profile_unfollow: function(follower, followee) {
		Meteor.users.update({_id: followee}, {$inc: {follower_count: -1}});
		Meteor.users.update({_id: follower}, {$inc: {following_count: -1}});

		Meteor.users.update({_id: followee}, {$pull: {followers: follower}});
		Meteor.users.update({_id: follower}, {$pull: {following: followee}});		
	}
});