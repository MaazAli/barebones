Meteor.methods({
	create_alert: function(alerted_user_id, user_id, username, content_type, content_id, action) {

		// We can also make the assumption that create_alert is only called from the server
		// in which case we don't have to worry about all checks.

		if (user_id != Meteor.userId()) {
			return null;
		}

		if (username != Meteor.user().username) {
			return null;
		}

		// If the user commented on his/her own post then we shouldn't alert them.
		// User isn't allowed to like / upvote/downvote their own posts so that's already handled

		if (alerted_user_id == user_id && action == "comment") {
			return null; // Nothing was updated
		}


		// If the same exact alert has been built again, ignore it.
		// For example: If someone liked your post, then unliked it
		// You already have been alerted that they've liked it.
		// So if they like it again, ever, in history. There is no need
		// for another alert.

		var previous_alert = User_alerts.findOne({alerted_user_id: alerted_user_id, user_id: user_id, username: username, content_type: content_type, content_id: content_id, action: action});


		if (previous_alert) {
			return null; // Nothing happened essentially
		}


		// If alerted_user_id, content_type, content_id, and action are the same then we can group the usernames/user_ids.
		var previous_alert_group = User_alerts.findOne({alerted_user_id: alerted_user_id, content_type: content_type, content_id: content_id, action: action});

		if (previous_alert_group) {
			User_alerts.update({_id: previous_alert_group._id}, {$push: {username: username}});
			User_alerts.update({_id: previous_alert_group._id}, {$push: {user_id: user_id}});

			// Reset view_date to 0 because the alert has now changed so we should show it again! 
			User_alerts.update({_id: previous_alert_group._id}, {$set: {view_date: 0}});

			// We should also update event date to the current date
			User_alerts.update({_id: previous_alert_group._id}, {$set: {event_date: Date.now()}});

			return previous_alert_group._id;
		}



		// Create new alert if no updates are made to previous alerts, then we need to create a new one!
		var newID = User_alerts.insert({
			alerted_user_id: alerted_user_id,
			user_id: [
				user_id
			],
			username: [
				username
			],
			content_type: content_type,
			content_id: content_id,
			action: action,
			event_date: Date.now(),
			view_date: 0 // 0 means that it hasn't been viewed (Can be used to check)
		});

		return newID;		


	}
});