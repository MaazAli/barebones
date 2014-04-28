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

Template.profile_post_item.events = {

	'click .profile_post_like_handler' : function(event) {
		var profile_post_id = this._id;
		var current_user_id = Meteor.userId();
		//console.log($(event.target).attr('id'));
		Meteor.call('profile_post_like', profile_post_id, current_user_id, function(error, results) {

			if (error) {
				console.log('profile_post_like error ' + error);
			} else {
				var current_content = $('#profile_post_like_' + profile_post_id).html();
				console.log(current_content)
				if (current_content == "Like") {
					$('#profile_post_like_' + profile_post_id).html('Unlike');
				} else if (current_content == "Unlike") {
					$('#profile_post_like_' + profile_post_id).html('Like');
				}
			}

		});
	}


}

Template.profile_post_item.is_profile_post_liked = function(id) {
	var profile_post = Profile_posts.findOne({_id: id});
	var current_user_id = Meteor.userId();
	if ($.inArray(current_user_id, profile_post.users_liked) > -1) {
		return true;	
	} else {
		return false;
	}
}

Template.profile_post_item.user_owns_post = function(username) {
	if (username == Meteor.user().username) {
		return true;
	} else {
		return false;
	}
};

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
