Meteor.methods({
	create_tag: function(tag_name, tag_slug, tag_description, username, user_id) {

			var newID = Tags.insert({
				tag_name: tag_name,
				tag_slug: tag_slug,
				tag_description: tag_description,
				created_by: username,
				create_by_id: user_id,
				questions_tagged: 0,
				created_timestamp: Date.now(),
				activity_timestamp: 0,
				view_count: 0
			});

			return newID;
	},
	increment_questions_tagged_tags: function (tags_array) {
		for(i = 0; i < tags_array.length; i++) {
			Tags.update({tag_name: tags_array[i]}, {$inc: {questions_tagged: 1}});
		}
	},
	update_activity_timestamps_tags: function (tags_array) {
		for(i = 0; i < tags_array.length; i++) {
			Tags.update({tag_name: tags_array[i]}, {$set: {activity_timestamp: Date.now()}});
		}
	}
});

