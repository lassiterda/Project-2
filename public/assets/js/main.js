//When the document is ready, the following code will run\

	var locationsGlobal = [];

$(document).ready(function(){

	// =============== Program Logic ===============

	//we're declaring a global array to hold locations data
	//so that we may access it from anywhere in the program
	//without running into scoping issues

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

	$('.location-box').on('click', function() {

		$('this').removeClass('location-box');
		$('this').addClass('location-box-active');
	});//end of click-event

	$('#add-location-btn').on('click', function() {

		//prevents the element's default behavior from triggering
		event.preventDefault();
		addLocation();
	});//end of click-event

	// $('#build-trip-btn').on('click', function() {
	//
	// 	//prevents the element's default behavior from triggering
	// 	event.preventDefault();
	//
	// 	snatchSelectedLocations();
	//
	//
	//
	//
	// });//end of click-event
$("#build-trip-btn").click(function(){

  //check to see if text says buid trips

  var removedIds = [];

  //remove all nonselected elements
	$(".location-box").each(function(idx, ele) {
		console.log(!$(ele).hasClass("location-box-active"));
		if (!$(ele).hasClass("location-box-active")) {

			locationsGlobal =locationsGlobal.filter(function(loc) {
				return loc.about.id != $(ele).attr("location-id")
			})
			$(this).fadeOut("fast", function(){

				$(this).remove();
			})
		}
		else {
			$(this).off()
		}
	})

  // make remaining elements sortable
  Sortable.create(document.getElementById("side-bar"));

  clearMarkers();

  //can this be done on initHome(), or would it conflict with base `map`?
  calcRoute(locationsGlobal, function(response) {
    console.log(response);
  })

})

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

			initMap(data);

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

	function initMap(data) {

		//coordinates and settings for Charlotte Map
		const Charlotte = {
			center: {lat: 35.22, lng: -80.84},
			scrollwheel: false,
			zoom: 13
		}

		//map
		map = new google.maps.Map(document.getElementById('map-location'), Charlotte);
	    directionsDisplay = new google.maps.DirectionsRenderer();
	    directionsService = new google.maps.DirectionsService();
	    directionsDisplay.setMap(map);
		renderPins(map, data);

	}//end of initMap

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

			var $newLocation = {};

			//setting properties to the object
			$newLocation.box = $("<div />");
			$newLocation.isSelected = true;
			$newLocation.about = {
				lat: locations.data[i].lat,
				lng: locations.data[i].lng,
				id: locations.data[i].id,
				Google_place_id: locations.data[i].Google_place_id,
				name: locations.data[i].name,
				address: {
					street: locations.data[i].address,
					city: locations.data[i].city,
					state: locations.data[i].state,
					zip: locations.data[i].zip
				},
				description: locations.data[i].description,
			};


			$newLocation.box.addClass('location-box');
			$newLocation.box.attr('location-id', locations.data[i].id);

			$newLocation.box.append("<h6>"+ locations.data[i].name + "</h6>");
			$newLocation.box.append("<p>Address: " + locations.data[i].address + "</p>");
			$newLocation.box.click(function() {
				if ($(this).hasClass("location-box-active") ) {
					$(this).removeClass('location-box-active');
				}
				else {
					$(this).addClass('location-box-active');
				}
			})



			//push individual div to global array
			locationsGlobal.push($newLocation);

			//append the div we just constructed and popuated to the side bar
			$("#side-bar").append(locationsGlobal[i].box);

		}//end of loop

		console.log("Global Array: " + locationsGlobal);

	}

	function renderPins(map, locations) {
		Arrmarkers = []
		for(i = 0; i < locations.data.length; i++) {
			var position = new google.maps.LatLng(locations.data[i].lat, locations.data[i].lng);

	                marker = new google.maps.Marker({
	                	position: position,
	                	map: map,
	                	animation: google.maps.Animation.DROP,
	                	title: locations.data[i].name
	                });
									Arrmarkers.push(marker);
        }

	}

	function addLocation() {

		console.log('inside addLocation function');

		$('#add-location-modal').modal('toggle');

		$(document).on('click', '#submit-location', function() {

			event.preventDefault();
			console.log('clicked');

			var newLocation = {

				name: $('#location-name-input').val().trim(),
				address: $('#address-input').val().trim(),
				city: $('#city-input').val().trim(),
				state: $('#state-input').val().trim(),
				zip: $('#zip-input').val().trim(),
				description: $('#description-input').val().trim()

			}

			$.post('/api/location/create', newLocation)
			.done(function(response) {

				console.log("Location successfully added!");
				console.log(response);
				$('#add-location-modal').modal('hide');
				initHome();

			});

			// alertify.success("Location successfully added!");

		})


	}

	function snatchSelectedLocations() {

		let tripDirections = [];

		for (var i = 0; i < locationsGlobal.length; i++) {

			if(locationsGlobal[i].isSelected === true){

				tripDirections.push(locationsGlobal[i]);

			}

		};//end of for loop

		renderTrip(tripDirections);



	}//end of snatchSelectedLocations

	function calcRoute(arrLocs, cb) {
	    var origin = arrLocs.shift()
	    var destination = arrLocs.pop();

	    var request = {
	        origin: {lat:origin.about.lat, lng: origin.about.lng},
	        destination: {lat: destination.about.lat, lng: destination.about.lng},
	        waypoints: arrLocs.map(function(ele){
	          return { location: {lat: ele.about.lat, lng: ele.about.lng }, stopover: true }
	        }),
	        travelMode: google.maps.TravelMode["WALKING"]
	    }

	    directionsService.route(request, function(response, status) {
	        if(status == "OK") {
	            directionsDisplay.setDirections(response);
	            cb(response)
	    }});
	}

	function clearMarkers() {
		setMapOnAll(null);
	}

	function setMapOnAll(map) {
		for (var i = 0; i < Arrmarkers.length; i++) {
			Arrmarkers[i].setMap(map);
		}
	}
	// =============== END OF FUNCTIONS ===============

})//end of document.ready
