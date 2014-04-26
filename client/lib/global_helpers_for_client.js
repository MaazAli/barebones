slug_username = function(username) {
	var username_slug = username.toLowerCase().replace(' ', '-');
	var username_slug = username_slug.replace('.', '-');
	var username_slug = username_slug.replace('_', '-');	
	return username_slug;	
}