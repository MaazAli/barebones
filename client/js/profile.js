Template.profile_main.recent_questions = function () {
	return Questions.find({user_id: this._id}, {sort: {created_timestamp: -1}})
};

Template.profile_main.recent_answers = function () {
	return Answers.find({user_id: this._id}, {sort: {created_timestamp: -1}});
};

Template.profile_post_submission_form.profile_post_check = function(username) {
	if (username == Meteor.user().username) {
		return "What's on your mind?";
	} else {
		return "Write something...";
	}
};

// Template.profile_sidebar.user_owns_profile = function(username) {
// 	if (username == Meteor.user().username) {
// 		return true;
// 	} else {
// 		return false;
// 	}
// };

Template.profile_sidebar.user_following = function(username) {
	var current_user = Meteor.user();
	
	if (current_user != null && $.inArray(username, current_user.following) > -1) {
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
		var content = $('#profile_post_submission_input').val().trim();
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
		var profile_post = $('#profile_post_submission_input').val().trim();
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

			if (profile_user_id == user_id) {
				Meteor.call('update_status_message', user_id, profile_post, function(error, results) {
					if (error) {
						console.log('update_status_message ' + error);
					} else {
						console.log('Your status has been updated');
					}				

				});				
			}
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
	},

	'click .profile_post_comment_handler' : function(event) {
		var profile_post_id = this._id;
		var element = "#comment-submission_" + profile_post_id;

		$(element + ' textarea').focus();

		// if ($(element).hasClass('closed')) {
		// 	$(element).removeClass('closed');
		// 	$(element).addClass('open');
		// }  else {
		// 	$(element).removeClass('open');
		// 	$(element).addClass('closed');			
		// }
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
};

Template.profile_post_item.user_owns_post = function(username) {
	if (username == Meteor.user().username) {
		return true;
	} else {
		return false;
	}
};

Template.profile_post_item.comment = function() {
	return Comments.find({content_id: this._id});
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


Template.profile_cover.events = {
	'blur #avatar_changer_url' : function(event) {
		var img_url = $('#avatar_changer_url').val();
		if (img_url != '') {
			$('#avatar_changer_preview').attr('src', img_url);
		}
	},

	'click #avatar_changer_save' : function(event) {


		var img = new Image();
		img.onload = function() {
			// console.log("Url: " + this.src + "\n Height: " + this.height + "\n Width: " + this.width);
			if (this.src != '') {
				Meteor.call('user_avatar_changer', Meteor.userId(), this.src, this.height, this.width, function(error, results) {

					if (error) {
						console.log('user_avatar_changer error ' + error);
					} else {
						console.log('Avatar Changed Successfully');
						$('#avatar_changer').modal('toggle');
					}

				});
			}
		}
		img.src = $('#avatar_changer_url').val();
	},

	'click #profile-cover-changer-handler' : function(event) {
		var wrapper = $('.profile-cover-changer-wrapper');

		if (wrapper.hasClass('close')) {
			wrapper.removeClass('close');
			wrapper.addClass('open');
			$('#profile-cover-changer-handler').css('border-top-right-radius', '0px');
			$('#profile-cover-changer-handler').css('border-top-left-radius', '0px');

		} else {
			wrapper.removeClass('open');
			wrapper.addClass('close');		
			$('#profile-cover-changer-handler').css('border-top-right-radius', '3px');
			$('#profile-cover-changer-handler').css('border-top-left-radius', '3px');	
		}
	},

	'blur #profile_cover_changer_url' : function(event) {
		var img_url = $('#profile_cover_changer_url').val();

		if (img_url != '') {
			$('.profile-cover-wrapper').css('background', 'url("' + img_url + '")');
		}
	},

	'click #profile_cover_save' : function(event) {
		var wrapper = $('.profile-cover-changer-wrapper');
		var img = new Image();
		img.onload = function() {
			// console.log("Url: " + this.src + "\n Height: " + this.height + "\n Width: " + this.width);
			if (this.src != '') {
				Meteor.call('profile_cover_changer', Meteor.userId(), this.src, this.height, this.width, function(error, results) {

					if (error) {
						console.log('profile_cover_changer error ' + error);
					} else {
						console.log('Profile Cover Changed Successfully');
						wrapper.removeClass('open');
						wrapper.addClass('close');
					}	
				});
			}
		}
		img.src = $('#profile_cover_changer_url').val();		
	}
}


Template.list_alerts.alert = function() {
	var alerts = User_alerts.find({alerted_user_id: Meteor.userId()}, {sort: {event_date: -1}, limit: 10}).fetch();

	return alerts;
}


Template.profile_main.rendered = function() {
	var site_name = "barebones";
	document.title = this.data.username + " | " + site_name;

	// On load set the profile tab to the first one
	$('#profile_tabs a:first').tab('show');
}

Template.profile_main.events({
	'click #profile_tabs a' : function(event) {
		event.preventDefault();
		$(event.target).tab('show');
	}
});