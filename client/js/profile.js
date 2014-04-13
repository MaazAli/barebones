Template.profile_main.recent_questions = function () {
	return Questions.find({user_id: this._id}, {sort: {created_timestamp: 1}})
}