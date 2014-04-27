Template.profile_main.recent_questions = function () {
	return Questions.find({user_id: this._id}, {sort: {created_timestamp: -1}})
};

Template.profile_post_submission_form.profile_post_check = function(username) {
	if (username == Meteor.user().username) {
		return "What's on your mind?";
	} else {
		return "Write something...";
	}
};

Template.profile_sidebar.user_owns_profile = function(username) {
	if (username == Meteor.user().username) {
		return true;
	} else {
		return false;
	}
};

Template.profile_sidebar.user_following = function(username) {
	var current_user = Meteor.user();
	console.log($.inArray(username, current_user.following));
	if ($.inArray(username, current_user.following) > -1) {
		return true;
	} else {
		return false;
	}
};



Template.profile_post_submission_form.rendered = function() {
	$('#profile_post_submit').prop('disabled', true);
}


Template.profile_post_submission_form.events = {


	'keyup, keypress, blur #profile_post_submission_input' : function(event) {
		var content = $('#profile_post_submission_input').val();
		var max_profile_post_length = 140;
		if (content.length >= 1) {
			$('#profile_post_submit').prop('disabled', false);
		} else {
			$('#profile_post_submit').prop('disabled', true);
		}

		$('.char-indicator').html(max_profile_post_length - content.length);
	},

	'click #profile_post_submit' : function(event) {
		var max_profile_post_length = 140; 
		var profile_post = $('#profile_post_submission_input').val();
		var user_object = Meteor.user();
		var username = user_object.username;
		var user_id = user_object._id;
		var profile_username = this.username;
		var profile_user_id = this._id;

		if (profile_post.length <= 140 && profile_post.length >= 1  && user_object) {
			Meteor.call('create_profile_post', profile_username, profile_user_id, username, user_id, profile_post, function(error, results) {
				if (error) {
					console.log('create_profile_post error ' + error);
					console.log('create_profile_post result ' + result);
				} else {
					console.log('Your profile post has been posted.');
					$('#profile_post_submission_input').val('');
				}				

			});
		}


	}


}


Template.profile_main.profile_post = function() {
	console.log(this._id);
	return Profile_posts.find({profile_user_id: this._id}, {sort: {created_timestamp: -1}});
};

/**------ Profile Side bar events ----***/

Template.profile_sidebar.events = {

	'click #profile_follow' : function(event) {
		var follower = Meteor.userId();
		var followee = this._id;
		Meteor.call('profile_follow', follower, followee, function(error, results) {

			if (error) {
				console.log('create_profile_post error ' + error);
			} else {
				console.log('Followed successfully.');
			}

		});
	},
	'click #profile_unfollow' : function(event) {
		var follower = Meteor.userId();
		var followee = this._id;
		Meteor.call('profile_unfollow', follower, followee, function(error, results) {

			if (error) {
				console.log('create_profile_post error ' + error);
			} else {
				console.log('Unfollowed successfully.');
			}

		});
	}
}