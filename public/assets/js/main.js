//When the document is ready, the following code will run
$(document).ready(function(){

	// =============== Program Logic ===============

	//initializes home page
	initHome();

	//it is assumed that if this click event triggers, the btn is not disabled anymore
	$("#my-trips-btn").on("click", function() {

		//prevents the element's default behavior from triggering
		event.preventDefault();

		var btn = $("#my-trips-btn");

		//if the button reads "My Trips" re-render side bar and change its text to "Locations"
		if(btn.text() === "My Trips"){

			//makes the AJAX call and calls the functions that renders side bar with trips data
			getMyTrips();
			btn.text('Locations');

		} //otherwise do the opposite
		else if(btn.text() === "Locations"){
			//makes the AJAX call and calls the functions that renders side bar with locations data
			getLocations();
			btn.text("My Trips");
		}

	});//end of click-event


	// =============== End of Program Logic ===============

	// *****************************************************

	// =============== FUNCTIONS ===============

	function initHome() {

		//enables My Trips button is there is at least one trip in database
		areThereTrips();

		var currentURL = window.location.origin;

		//API call to the server to retrieve locations data
		$.get(currentURL + "/api/location")
		.done(function(data) {

			console.log(data);
			//initMap(data);
			//here we have our locations data from the API
			//now we have to render map, render pins, and render side bar
			//|-> initHome()
				//|-> areThereTrips();
				//|-> AJAX Call
					//|-> initMap(data)
						//|-> renderPins(data);
			renderSideBarWithLocations(data);

		});

	}//end of initHome

	
	//returns nothing. used to disable or disable My Trips button
	function areThereTrips() {

		//remove this line once AJAX call works
		$("#my-trips-btn").prop("disabled", false);

		// $.get("/api/trips")
		// .done(function(data) {

		// 	// console.log("Trips data: " + data);
		// 	//if at least one trip, set disabled to false
		// 	//else, set disabled to true , or do nothing since default is disabled
		// 	if(true){
		// 		$("#my-trips-btn").prop("disabled", false);
		// 	}
			
		// })

	}//end of areThereTrips


	//retrieves user trips from database
	function getMyTrips() {

		//get all trips info
		$.get("/api/trips")
		.done(function(data) {

			//here we will clear and
			//re-render the side bar
			$("#side-bar").empty();

			//this function will take care of the task.
			//we have yet to write it, but we'll recycle
			//and tweak the code of the renderSideBarWithLocations function
			renderSideBarWithTrips(data);
		
		})

	}//end of showMyTrips


	function getLocations() {

		//get all trips info
		$.get("/api/location")
		.done(function(data) {

			//here we will clear and
			//re-render the side bar
			$("#side-bar").empty();

			//this function will take care of the task.
			//we have yet to write it, but we'll recycle
			//and tweak the code of the renderSideBarWithLocations function
			renderSideBarWithLocations(data);
		
		})

	}


	function renderSideBarWithTrips(trips) {

		//emptying the side bar before re-populating it
		$("#side-bar").empty();

		for (i = 0; i <= trips.data.length; i++){

			var $newTrip = $("<div />");

			$newTrip.addClass('trip-box');
			$newTrip.attr('trip-id', trips.data[i].id);

			$newTrip.append("Trip Info Goes Here");
		}

	}

	function renderSideBarWithLocations(locations){

		//emptying the side bar before re-populating it
		$("#side-bar").empty();

		for (i = 0; i <= locations.data.length; i++){

			var $newLocation = $("<div />");
			var $checkbox = $('<br><input type="checkbox" name="checkbox" value="none">');

			$newLocation.addClass('location-box');
			$checkbox.addClass('trip-selector');
			$newLocation.attr('location-id', locations.data[i].id);

			$newLocation.append(locations.data[i].name + "\n");
			$newLocation.append("Address: " + locations.data[i].address);

			//have yet to append the description... need to style location-box
			//appropriately to fit everything in nicely
			$newLocation.append($checkbox);	

			//append the div we just constructed and popuated to the side bar
			$("#side-bar").append($newLocation);
		}

	}

	// =============== END OF FUNCTIONS ===============

})//end of document.ready