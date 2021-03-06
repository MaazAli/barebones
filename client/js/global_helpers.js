UI.registerHelper('get_user_profile_picture', function(id) {
	user_object = Meteor.users.findOne({_id: id});
	if (user_object) {
		return user_object.profile.avatar.url;
	}
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

UI.registerHelper('user_owns_profile', function(username) {
	console.log(username);
	if(Meteor.user() == null) {
		return false;
	}

	if (username == Meteor.user().username) {
		return true;
	} else {
		return false;
	}

});

UI.registerHelper('arrayify_object', function(obj) {
	result = [];
	for (var key in obj) {
		result.push({name:key, value: obj[key]});
	}
	return result;
});