UI.registerHelper('get_user_profile_picture', function(id) {
	user_object = Meteor.users.findOne({_id: id});
	return user_object.profile.avatar.url;
});