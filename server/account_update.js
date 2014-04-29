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
	increment_influence_points_user_per_tag: function(amount, tag) {
		var user = Meteor.users.findOne({_id:this.userId});
		if (tag in user.influence) {
			updated_points = user.influence[tag].influence_points + amount;
			user.influence[tag].influence_points = updated_points;
			current_level = user.influence[tag].level;

			while (updated_points >= (current_level*current_level - current_level + 6)) {
				current_level++;
				Meteor.users.update({_id: this.userId}, {$inc: {level_count: 1}});
			}

			user.influence[tag].level = current_level;
		} else {
			user.influence[tag] = {influence_points: amount, level: 1};
			Meteor.users.update({_id: this.userId}, {$inc: {level_count: 1}});
		}
		var new_object = {};
		new_object["influence"] = user.influence;

		Meteor.users.update({_id: this.userId}, {$set: new_object});
	}	
});

