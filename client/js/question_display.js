Template.question_list_front_page.questions = function() {

  var items = Questions.find({}, {sort: {created_timestamp: -1}, limit: 20}).map(function(doc, index, cursor) {
    var i = _.extend(doc, {index: index});
    return i;
  });
  return items;
}

Template.question_list_front_page.divides3 = function(index) {

	if (index % 3 == 0) {
		return true
	} else {
		return false;
	}

}


UI.registerHelper('user_slugged', function(username) {
	var username_slug = username.toLowerCase().replace(' ', '-');
	var username_slug = username_slug.replace('.', '-');
	var username_slug = username_slug.replace('_', '-');	
	return username_slug;
});