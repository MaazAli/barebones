/* 
	Handles general templates
	like Header, Footer, and so on
*/

Template.header.current_user = function() {
	return Meteor.user();
}