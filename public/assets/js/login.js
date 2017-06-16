$(document).ready(function(){

	$('#login').on('click', function() {

		event.preventDefault();

		var userLoginInfo = {
			username: $('#userName').val().trim(),
			password: $('#password').val().trim()
		}

		console.log(userLoginInfo)

		$.post('user/login', userLoginInfo)
		.done(function(response) {
			console.log(response);

			window.location = '/home';
		})

	})

})//end of document.ready
