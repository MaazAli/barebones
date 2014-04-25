UI.registerHelper('get_user_profile_picture', function(id) {
	user_object = Meteor.users.findOne({_id: id});
	return user_object.profile.avatar.url;
});


UI.registerHelper('user_slugged', function(username) {
	var username_slug = username.toLowerCase().replace(' ', '-');
	var username_slug = username_slug.replace('.', '-');
	var username_slug = username_slug.replace('_', '-');	
	return username_slug;
});

UI.registerHelper('votes_positive', function(votes) {
	return votes>=0;
});