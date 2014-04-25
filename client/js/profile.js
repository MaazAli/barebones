Template.profile_main.recent_questions = function () {
	return Questions.find({user_id: this._id}, {sort: {created_timestamp: -1}})
}

Template.profile_post_submission_form.profile_post_check = function(username) {
	if (username == Meteor.user().username) {
		return "What's on your mind?";
	} else {
		return "Write something...";
	}
}