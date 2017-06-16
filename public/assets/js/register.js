$(document).ready(function(){

	$('#submit').on('click', function() {

		event.preventDefault();

		var newUser = {
			firstName: $("#first-name").val().trim(),
			lastName: $("#last-name").val().trim(),
			userName: $("#username").val().trim(),
			password: $("#password").val().trim(),
			confirmPass: $("#confirm-password").val().trim(),
			email: $("#email").val().trim()
		}

		// console.log(newUser);

		if(newUser.password === newUser.confirmPass){

			//create new user by posting it to server
			$.post("/user/register", newUser)
			.done(function(response) {

				$("#first-name").val('');
				$("#last-name").val('');
				$("#username").val('');
				$("#password").val('');
				$("#confirm-password").val('');
				$("#email").val('');

				console.log(response);
				window.location = '/home';
			});

			console.log("Passwords match, new user created");

		}else{
			$("#password").val('');
			$("#confirm-password").val('');
			alertify.warning('Passwords do not match, please try again');
		}

		
	})

})//end of document.ready