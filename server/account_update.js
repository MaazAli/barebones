Meteor.methods({
	increment_question_count_user: function () {
		Meteor.users.update({_id: this.userId}, {$inc: {question_count: 1}});
	},
	increment_answer_count_user: function() {
		Meteor.users.update({_id: this.userId}, {$inc: {answer_count: 1}});
	},
	increment_comment_count_user: function() {
		Meteor.users.update({_id: this.userId}, {$inc: {comment_count: 1}});
	},
	increment_influence_points_user: function(amount) {
		Meteor.users.update({_id: this.userId}, {$inc: {influence_points: amount}});
	}
});

