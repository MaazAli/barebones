slug_username = function(username) {
	var username_slug = username.toLowerCase().replace(' ', '-');
	var username_slug = username_slug.replace('.', '-');
	var username_slug = username_slug.replace('_', '-');	
	return username_slug;	
}

get_username_by_id = function(user_id) {
	return Meteor.users.findOne({_id: user_id}).username;
}

// Helper function for the rest of the helper functions

format_users = function(user_array) {
	console.log(user_array);
	var users_formatted;

	for (var i = 0; i < user_array.length; i++) {
		if (users_formatted != undefined) {
			users_formatted = users_formatted + '<a href="/members/' + slug_username(user_array[i]) + '">' + user_array[i] + '</a>';
		} else {
			users_formatted = '<a href="/members/' + slug_username(user_array[i]) + '">' + user_array[i] + '</a>';
		}

		// If it's second last
		if (i == user_array.length - 2) {
			users_formatted = users_formatted + " and ";
		} else if (i < user_array.length - 1) {
			users_formatted = users_formatted +  ", ";
		} 

		console.log(users_formatted);

	}
	console.log(users_formatted);
	return users_formatted;
}
