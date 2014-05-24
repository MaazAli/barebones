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

Template.question_list_front_page.rendered = function() {
	var site_name = "barebones";
	var site_slogan = "A simple question and answering site";
	document.title = site_name + " | " + site_slogan
}