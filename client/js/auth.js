Template.register_form.events = { 

	'click #register_button' : function(event) { 

		event.preventDefault();

		var name = $('#register_name').val().trim();
		var email = $('#register_email').val().trim();
		var password = $('#register_password').val();
		var confirm_password = $('#register_confirm_password').val();
		var gender = $("input[name='gender']:checked").val();

		// Checks
		var name_check = /^[A-Za-z0-9_. ]{3,20}$/;
		var email_check = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		var password_check = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;


		if (!name_check.test(name)) {

			$('#register_name').parent().addClass('has-error');

		} 
		if (!email_check.test(email)) {

			$('#register_email').parent().addClass('has-error');

		} 
		if (!password_check.test(password)) {

			$('#register_password').parent().addClass('has-error');

		} 
		if (confirm_password != password || confirm_password == '') {

			$('#register_confirm_password').parent().addClass('has-error');

		} 
		if (!gender) {

			$('#gender_choice_label').parent().addClass('has-error');

		}

		if (name_check.test(name) && email_check.test(email) && password_check.test(password) && (confirm_password == password) && gender) {

			options = {
				username: name,
				email: email,
				password: password,
				profile: {
					gender: gender,
					avatar: {
						url: '/images/avatar/default.png',
						height: 200,
						weidth: 200
					},
					profile_cover: {
						url: '/images/profile-cover/default.jpg',
						height: 960,
						width: 250
					}
				}
			};

			Accounts.createUser(options);
			Router.go('ask_question', {});
		}

	},

	'focusout #register_name' : function (event) {

		var name = $('#register_name').val();
		console.log(name);

		Meteor.call('username_exists', name, function(error, result) {

			if (error) {
				console.log('Eek! Something went wrong when calling "username_exists".');
			} else {
				console.log(result);
			}
		});
	},

	'focusout #register_email' : function (event) {

		var email = $('#register_email').val();

		Meteor.call('email_exists', name, function(error, result) {

			if (error) {
				console.log('Eek! Something went wrong when calling "email_exists".');
			} else {
				console.log(result);
			}
		});

	}

}

Template.header.events = {

	'click #logout_button' : function(event) {
		Meteor.logout();
	},

	'click #login_register' : function(event) {
		Router.go('register_page');
	},

	'click #login_sign_in' : function(event) {
		event.preventDefault();
		console.log('WHats up');

		var user = $('#login_username').val();
		var pass = $('#login_password').val();


		Meteor.loginWithPassword(user, pass, function(error) {
			if (!error) {
				$('#login_overlay').modal('hide');
			} else {
				$('#login_password').parent().addClass('has-error');
				$('#login_username').parent().addClass('has-error');
			}
		});
	}


}