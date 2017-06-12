$(document).ready(function(){

	// =============== Program Logic ===============

	clickHandlers.areThereTrips();









	// =============== End of Program Logic ===============

	// *****************************************************

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

	
	//returns nothing. used to disable or disable My Trips button
	function areThereTrips() {

		$.get("/api/trips", function (data) {

			console.log(response.data);

		}).done(function(data) {
			
			//if at least one trip, set disabled to false
			//else, set disabled to true , or do nothing since default is disabled
			if(true){
				$("#my-trips-btn").prop("disabled", false);
			}
			
		})

	}//end of areThereTrips

	// =============== END OF FUNCTIONS ===============

})//end of document.ready