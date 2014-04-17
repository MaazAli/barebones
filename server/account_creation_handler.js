Accounts.onCreateUser(function(options, user) {

	// Add statistics
	user.question_count = 0;
	user.answer_count = 0;
	user.comment_count = 0;
	user.influence_points = 0;
	user.specific_stats = {}

	// Generate the username slug
	var username = user.username;
	var username_slug = username.toLowerCase().replace(' ', '-');
	username_slug = username_slug.replace('.', '-');
	username_slug = username_slug.replace('_', '-');	

	user.username_slug = username_slug;

	if(options.profile) {
		user.profile = options.profile;
	}

	return user;

});

Meteor.methods({
	check_shadygamer : function(user, pass) {
		this.unblock();
		return HTTP.call("GET", "http://shadygamer.com/api.php?action=authenticate&username=" + user + "&password=" + pass);
	},
	shadygamer_get_user : function(user, hash) {
		this.unblock();
		return HTTP.call("GET", "http://www.shadygamer.com/api.php?action=getUser&hash=" + user + ":" + hash);		
	},
	username_exists : function (name) {
		var exists = Meteor.users.findOne({username: name});

		if (exists) {
			return true;
		} else {
			return false;
		}
	},
	email_exists : function (email) {
		var exists = Meteor.users.findOne({emails: {$in: [email]}});

		if (exists) {
			return true;
		} else {
			return false;
		}		
	}
});