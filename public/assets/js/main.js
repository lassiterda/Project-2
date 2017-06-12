$(document).ready(function(){

	// Program

	





	// =============== FUNCTIONS ===============

	function initHome() {

		var APIdata = null;
		var currentURL = window.location.origin;

		//GET API call to the server
		$.get(currentURL + "/", function(data){
			//variable data holds data returned by the API
			console.log("This is what the API returns: " + data);
			APIdata = data;

		}).done(function() {

			console.log("Now we've left the AJAX call: " + APIdata);

		});


	}//end of initHome

	

})//end of document.ready