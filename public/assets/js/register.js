$(document).ready(function(){

	$('#submit').on('click', function() {

		event.preventDefault();

		var newUser = {
			firstName: $("#first-name").val().trim(),
			lastName: $("#last-name").val().trim(),
			userName: $("#username").val().trim(),
			password: $("#password").val().trim(),
			zip: $("#zip").val().trim(),
			email: $("#email").val().trim()
		}

		console.log(newUser);

		//create new user by posting it to server
		$.post("/user/register", newUser)
		.done(function(response) {

			$("#first-name").val('');
			$("#last-name").val('');
			$("#username").val('');
			$("#password").val('');
			$("#zip").val('');
			$("#email").val('');

			console.log(response);
			window.location = '/home';

		});

		
	})

})//end of document.ready