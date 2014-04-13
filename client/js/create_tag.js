Template.tag_creation_form.events = {

	'click #add_tag_button' : function(event) {
		var tag_name = $('#tag_name_creation').val().trim();
		var tag_description = $('#tag_name_description').val().trim();
		var tag_name_already = Tags.findOne({tag_name: tag_name});

		var tag_slug = tag_name.toLowerCase().replace(' ', '-');

		var user_object = Meteor.user()
		var username = user_object.username;
		var user_id = user_object._id;

		if (tag_name == '') {
			alert('Please define a tag name')
		} else if (tag_description == '') {
			alert('Please describe your tag');
		} else if (tag_name_already) {
			alert('This tag already exists, please define a unique tag name.');
		} else {
			
			Meteor.call('create_tag', tag_name, tag_slug, tag_description, username, user_id, function(error, result) {
				console.log('create_tag error ' + error);
				console.log('create_tag result ' + result);

				if (error) {

				} else {
					console.log('Your tag was submitted');
					$('#tag_name_creation').val('');
					$('#tag_name_description').val('');
				}
			});

			console.log('Tag created');
		}
	}
}