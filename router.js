Router.map( function() {
	this.route('home', {
		path: '/',
		template: 'question_list_front_page',
		layoutTemplate: 'home_layout',
		yieldTemplates: {
			'header': {to: 'header'},
			'footer': {to: 'footer'}
		}
	});

	this.route('register_page', {
		path: '/register/',
		template: 'register_form',
		yieldTemplates: {
			'header': {to: 'header'},
			'footer': {to: 'footer'}
		}
	});

	this.route('create_tag', {
		path: '/tags/create',
		template: 'tag_creation_form',
		yieldTemplates: {
			'header': {to: 'header'},
			'footer': {to: 'footer'}
		}
	});

	this.route('tag_display', {
		path: '/tags/:tag_slug/',
		template: 'tag_display',
		yieldTemplates: {
			'header': {to: 'header'},
			'footer': {to: 'footer'}
		},
		waitOn : function() {
			return Meteor.subscribe('tags');
		},
		onBeforeAction: function () {
			NProgress.start();
			var id = this.params._id;

			// Updating the view count for Tags and setting the apropriate cookies

			if(ReactiveCookie.get('tag_viewed')) {
				var object_viewed = JSON.parse(ReactiveCookie.get('tag_viewed'));

				//console.log(object_viewed);

				if (!(id in object_viewed)) {
					object_viewed[id] = true;
					ReactiveCookie.set('tag_viewed', JSON.stringify(object_viewed), {days: 365});
					Tags.update({_id: id}, {$inc: {view_count: 1}});
				}

			} else {

				var object_viewed = {};
				object_viewed[id] = true;
				ReactiveCookie.set('tag_viewed', JSON.stringify(object_viewed), {days: 365});
				Tags.update({_id: id}, {$inc: {view_count: 1}});

			}
		},
		data : function () {
			return Tags.findOne({tag_slug : this.params.tag_slug});
		},

		onAfterAction : function() {
			//NProgress.stop();
		}

	});

	this.route('ask_question', {
		path: '/questions/ask',
		template: 'create_question',
		layoutTemplate: 'page_layout_no_sidebar',
		yieldTemplates: {
			'header': {to: 'header'},
			'footer': {to: 'footer'}
		}
	});

	this.route('question_display', {
		path: '/questions/:_id/:slug?/',
		layoutTemplate: 'question_layout',
		template: 'display_question',
		yieldTemplates: {
			'header': {to: 'header'},
			'footer': {to: 'footer'}
		},
		waitOn : function () { 
			return Meteor.subscribe('questions');
		},
		onBeforeAction: function () {
			var id = this.params._id;

			if (this.ready() == true) {
				var question = Questions.findOne({_id: id});
			
				if (question.slug != this.params.slug) {
					
					Router.go('question_display', {_id: id, slug: question.slug});
				}
			}

			// Updating the view count for Question and setting the apropriate cookies

			if(ReactiveCookie.get('question_viewed')) {
				var object_viewed = JSON.parse(ReactiveCookie.get('question_viewed'));

				//console.log(object_viewed);

				if (!(id in object_viewed)) {
					object_viewed[id] = true;
					ReactiveCookie.set('question_viewed', JSON.stringify(object_viewed), {days: 365});
					Questions.update({_id: id}, {$inc: {view_count: 1}});
				}

			} else {

				var object_viewed = {};
				object_viewed[id] = true;
				ReactiveCookie.set('question_viewed', JSON.stringify(object_viewed), {days: 365});
				Questions.update({_id: id}, {$inc: {view_count: 1}});

			}
		},
		data: function() {

			return Questions.findOne({_id: this.params._id});
		}
	});
	// this.route('member_display_alias1', {
	// 	path: '/members/:_id/username_slug?/',
	// 	waitOn : function () {
	// 		return Meteor.subscribe('all_users');
	// 	},
	// 	onBeforeAction: function() {
	// 		var id = this.params._id;

	// 		if (this.ready() == true) {
	// 			var user = Meteor.users.findOne({_id: id});

	// 			if (user) {
	// 				var username = user.username;
	// 				var username_slug = username.toLowerCase().replace(' ', '-');
	// 				var username_slug = username_slug.replace('.', '-');
	// 				var username_slug = username_slug.replace('_', '-');

	// 				Router.go('member_display', {username_slug: username_slug});
	// 			}
	// 		}
	// 	}
	// });
	this.route('member_display', {
		path: '/members/:username_slug/',
		layoutTemplate: 'profile_layout',
		template: 'profile_main',
		yieldTemplates: {
			'header': {to: 'header'},
			'footer': {to: 'footer'},
			'profile_cover': {to: 'profile_cover'},
			'profile_sidebar': {to: 'sidebar'}
		},
		waitOn : function () {
			return Meteor.subscribe('all_users');
		},
		onBeforeAction: function() {
			// var id = this.params.username_slug;

			// if (this.ready() == true) {
				
			// 	var user = Meteor.users.findOne({_id: id});
			// 	if (user) {
			// 		var username = user.username;
			// 		var username_slug = username.toLowerCase().replace(' ', '-');
			// 		var username_slug = username_slug.replace('.', '-');
			// 		var username_slug = username_slug.replace('_', '-');

			// 		if (username_slug != this.params.username_slug) {
			// 			Router.go('member_display', {_id: id, username_slug: username_slug});
			// 		}
			// 	}

			// }
			

		},
		data: function() {
			var slug = this.params.username_slug;
			return Meteor.users.findOne({username_slug: slug});
		}
	});

});



Router.configure({
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
	layoutTemplate: 'page_layout'
});



