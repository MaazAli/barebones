Meteor.publish('questions', function () { 
	return Questions.find({}); 
});

Meteor.publish('answers', function() {
	return Answers.find({});
});

Meteor.publish('comments', function() {
	return Comments.find({});
});

Meteor.publish('tags', function() {
	return Tags.find({});
});

Meteor.publish("userData", function () {
	return Meteor.users.find({_id: this.userId}, 
		{fields: {'question_count': 1, 'answer_count': 1, 'comment_count': 1, 'influence_points': 1, 'username_slug': 1}});
});

Meteor.publish('profile_posts', function() {
	return Profile_posts.find({});
});

Meteor.publish('all_users', function() {
	return Meteor.users.find({});
});

Meteor.publish('all_user_alerts', function() {
	return User_alerts.find({});
});
