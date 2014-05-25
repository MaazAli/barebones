


UI.registerHelper('user_alert_message', function(alert) {

	var alert_message, alerted_userslugged, url_builder, url_text, profile_post, profile_user_slugged, question_id;

	if (alert.action == "insert") {

		// Inserting a profile post alert message
		if (alert.content_type == "profile-post") {
			profile_post = Profile_posts.findOne({_id: alert.content_id});
			profile_user_slugged = slug_username(profile_post.profile_username);
			url_builder = '/members/' + profile_user_slugged + '/#' + alert.content_id;


			alert_message = format_users(alert.username) + ' wrote a message on <a href="' + url_builder + '"> your profile</a>.';

			return alert_message;
		}

		// Inserting an answer to a question alert
		if (alert.content_type == "answer") {
			question_id = Answers.findOne({_id: alert.content_id}).question_id;

			url_builder = '/questions/' + question_id + '/#' + alert.content_id;


			alert_message = format_users(alert.username) + ' answered <a href="' + url_builder + '"> your question</a>.';

			return alert_message;
		}
	}

	if (alert.action == "comment") {

		// When a user comments on your profile post
		if (alert.content_type == "profile-post") {
			profile_post = Profile_posts.findOne({_id: alert.content_id});
			if (profile_post.user_id == profile_post.profile_user_id) {
				url_text = "your status";
			} else {
				url_text = "your message";
			}

			alerted_userslugged = slug_username(alert.alerted_username);
			url_builder = '/members/' + slug_username(profile_post.profile_username) + '/#' + alert.content_id;


			alert_message = format_users(alert.username) + ' commented on <a href="' + url_builder + '">' + url_text + '</a>.';

			return alert_message;	
		}
		// When a user comments on an answer
		if (alert.content_type == "answer") {
			question_id = Answers.findOne({_id: alert.content_id}).question_id;
			url_text = "your answer";
			alerted_userslugged = slug_username(alert.alerted_username);
			url_builder = '/questions/' + question_id + '/#' + alert.content_id;


			alert_message = format_users(alert.username) + ' commented on <a href="' + url_builder + '">' + url_text + '</a>.';

			return alert_message;	
		}
		// When a user comments on your question
		if (alert.content_type == "question") {
			url_text = "your question";
			alerted_userslugged = slug_username(alert.alerted_username);
			url_builder = '/questions/' + alert.content_id;


			alert_message = format_users(alert.username) + ' commented on <a href="' + url_builder + '">' + url_text + '</a>.';

			return alert_message;	
		}
	}

	if (alert.action == "best-answer") {
		question_id = Answers.findOne({_id: alert.content_id}).question_id;

		url_text = "your answer"
		alerted_userslugged = slug_username(alert.alerted_username);
		url_builder = '/questions/' + question_id + '/#' + alert.content_id;


		alert_message = format_users(alert.username) + ' has selected <a href="' + url_builder + '">' + url_text + '</a> as the best one.';

		return alert_message;			
	}

	if (alert.action == "follow") {

		if (alert.username.length > 1) {
			alert_message = format_users(alert.username) + ' are now following you.';
		} else {
			alert_message = format_users(alert.username) + ' is now following you.';
		}

		return alert_message;				
	}

	// Upvotes and downvotes are only on answers and questions
	if (alert.action == "up-vote") {
		if (alert.content_type == "question") {
			url_text = "your question";
			alerted_userslugged = slug_username(alert.alerted_username);
			url_builder = '/questions/' + alert.content_id;


			alert_message = format_users(alert.username) + ' up voted <a href="' + url_builder + '">' + url_text + '</a>.';

			return alert_message;				
		}

		if (alert.content_type == "answer") {
			question_id = Answers.findOne({_id: alert.content_id}).question_id;

			url_text = "your answer";
			alerted_userslugged = slug_username(alert.alerted_username);
			url_builder = '/questions/' + question_id + '/#' + alert.content_id;


			alert_message = format_users(alert.username) + ' up voted <a href="' + url_builder + '">' + url_text + '</a>.';

			return alert_message;		
		}
	}

	if (alert.action == "down-vote") {
		if (alert.content_type == "question") {
			url_text = "your question";
			alerted_userslugged = slug_username(alert.alerted_username);
			url_builder = '/questions/' + alert.content_id;


			alert_message = format_users(alert.username) + ' down voted <a href="' + url_builder + '">' + url_text + '</a>.';

			return alert_message;				
		}

		if (alert.content_type == "answer") {
			question_id = Answers.findOne({_id: alert.content_id}).question_id;

			url_text = "your answer";
			alerted_userslugged = slug_username(alert.alerted_username);
			url_builder = '/questions/' + question_id + '/#' + alert.content_id;


			alert_message = format_users(alert.username) + ' down voted <a href="' + url_builder + '">' + url_text + '</a>.';

			return alert_message;		
		}
	}

	// Likes are for other things like comments, profile posts and so on...
	if (alert.action == "like") {
		if (alert.content_type == "profile-post") {
			profile_post = Profile_posts.findOne({_id: alert.content_id});
			profile_user_slugged = slug_username(profile_post.profile_username);
			url_builder = '/members/' + profile_user_slugged + '/#' + alert.content_id;

			// If it's alerted user's profile and the profile-post is owned by the same user
			if (profile_post.profile_user_id == profile_post.user_id) {
				url_text = "your status";
			} else {
				url_text = "your message";
			}

			alert_message = format_users(alert.username) + ' liked <a href="' + url_builder + '">' + url_text + '</a>.';

			return alert_message;
		}
	}
});