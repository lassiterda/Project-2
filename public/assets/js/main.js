//When the document is ready, the following code will run
	// =============== Program Logic ===============

	//we're declaring a global array to hold locations data
	//so that we may access it from anywhere in the program
	//without running into scoping issues
	var locationsGlobal = [];
	var myTripsGlobal = [];
	var Arrmarkers = [];
	var map;
	var directionsDisplay;
  var directionsService;

$(document).ready(function(){

	//initializes home page
	initHome();
	initScrollIndicatorToggles();

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

	$('#build-trip-btn').on('click', function() {

		if ($(".location-selected").length < 2) {
			console.log();
		}
		else {
			filterSelectedLocations(function($selected) {

				var list = document.getElementById("accordion");
				Sortable.create(list, {
					onSort: function(evt) {
						filterSelectedLocations(function($selected){
							renderTrip($selected)
						})
					}
				});

				$("#my-trips-btn")
					.text("Save")
					.off()
					.on("click", function(e) {
						filterSelectedLocations(function($selected) {
							$("#save-trip-modal").modal();
						})
					})


				$("#build-trip-btn")
					.removeClass("btn-primary")
					.addClass('btn-danger')
					.text("Reset")
					.off()
					.on("click", function(e) {
						window.location.reload();
					})



				clearMarkers();
				renderTrip($selected)
			});
		}


	});//end of click-event

	$("#submit-trip").on("click", function() {
		var tripName = $("#trip-name-input").val().trim();
		var tripDesc = $("#trip-desc-input").val().trim()

		var request = {
			name: tripName,
			description: tripDesc,
			locations: $(".accordion").map(function(idx, ele) {
				return $(ele).attr("location-id")
			}).toArray()
		}

		console.log(request);

		$.post("/api/trip/create", request)
			.done(function(response) {
				window.location.reload();
			})
	})
		// =============== End of Program Logic ===============
})//end of document.ready

	// =============== FUNCTIONS ===============

	function initScrollIndicatorToggles() {
		// create a variable; assign this to timeout later
		var t = null;
		// grab the scroll indicator element
		var scrollIndicator = $('.scroll-indicator')[0];
		// when the sidebar fires a scroll event...
		$('#side-bar').on('scroll', function() {
			// toggle-on the indicator's scrolling class to hide it
			scrollIndicator.classList.add('scrolling');
			// if there was a timeout set, remove it
			if (t) { clearTimeout(t); }
			// assign a new timeout to 't'
			t = setTimeout(function() {
				// toggle-off the indicator's scrolling class to show it
				// the overall effect is that we see the indicator after a brief period of inactivity
				scrollIndicator.classList.remove('scrolling');
			}, 1500);
		});
	}

	function initHome() {

		//enables My Trips button is there is at least one trip in database
		areThereTrips();

		//API call to the server to retrieve locations data
		$.get("/api/location")
		.done(function(data) {

			const Charlotte = {
				center: {lat: 35.22, lng: -80.84},
				scrollwheel: false,
				zoom: 13
			}

			//map setup
	    directionsDisplay = new google.maps.DirectionsRenderer();
	    directionsService = new google.maps.DirectionsService();
			map = new google.maps.Map(document.getElementById('map-location'), Charlotte);

		  directionsDisplay.setMap(map)

			renderPins(map, data)
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

	// TODO returns nothing. used to disable or disable My Trips button
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
		$.get("/api/user")
		.done(function(response) {
			console.log(response);
			//this function will take care of the task.
			//we have yet to write it, but we'll recycle
			//and tweak the code of the renderSideBarWithLocations function
			renderSideBarWithTrips(response.data[0].Trips);

		})

	}//end of showMyTrips

	//retreives All Locations from the db sorted by numLikes
	function getLocations() {

		//get all trips info
		$.get("/api/location")
		.done(function(data) {

			//this function will take care of the task.
			//we have yet to write it, but we'll recycle
			//and tweak the code of the renderSideBarWithLocations function
			renderSideBarWithLocations(data);

		})

	}

	// populates the sidebar with Trips based on the response from the db
	function renderSideBarWithTrips(apiTrips) {

		//emptying the side bar before re-populating it
		$(".my-side-bar").empty();
		// $(".accordion").fadeOut('slow');

		for (i = 0; i < apiTrips.length; i++){

			//setting properties to the object
			$newTrip = {
				accordion: {
					header: $('<button />'),
					body: $('<div />'),
					list: $('<ul />')
				}
			};

			// $newTrip.accordion.header.attr('trip-id', trips.data[i].id);

			//link to css properties to render elements into accordion
			$newTrip.accordion.header.addClass('accordion');
			$newTrip.accordion.body.addClass('panel');

			$newTrip.accordion.header.append(apiTrips[i].name);
			$newTrip.accordion.header.append($newTrip.accordion.selectToggle);


			apiTrips[i].Locations.forEach(function(ele){
				$newTrip.accordion.list.append('<li>'+ ele.name +'</li>');
				$newTrip.accordion.list.append('<p class="location-address">'+ ele.address +'</p>');
			})

			$newTrip.accordion.body.append($newTrip.accordion.list);

			//push individual div to global array
			myTripsGlobal.push($newTrip);

			//append the div we just constructed and popuated to the side bar
			$(".my-side-bar").append($newTrip.accordion.header);
			$(".my-side-bar").append($newTrip.accordion.body);
		}
	}

// Populates the sideBar with Locations retreived from the db.
	function renderSideBarWithLocations(locations){
    
		//emptying the side bar before re-populating it
		$(".my-side-bar").empty();

		for (i = 0; i < locations.data.length; i++){
			var $newLocation = {};

			$newLocation.isSelected = false;

			//setting properties to the object
			$newLocation = {
				accordion: {
					container: $('<div />').addClass("accordion-container"),
					header: $('<button />'),
					selectAdd: $('<img />').attr("src", "/assets/icons/core/plus-circle.svg").addClass("select-add").css("float", "right"),
					body: $('<div />')
				}
			};

			//append all of this data into the newLocation
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

			//link to css properties to render elements into accordion
			$newLocation.accordion.header.addClass('accordion');
			$newLocation.accordion.body.addClass('panel');

			$newLocation.accordion.header.append("<a href='#' class='accordion-expand'>" + locations.data[i].name + "</a>");
			$newLocation.accordion.body.append('<p>'+locations.data[i].description+'</p>');
			$newLocation.accordion.container.append($newLocation.accordion.header)
			$newLocation.accordion.container.append($newLocation.accordion.panel)
			$newLocation.accordion.header.append($newLocation.accordion.selectAdd)

			$newLocation.accordion.header.attr("location-id",locations.data[i].id);
			$newLocation.accordion.header.attr("lat", locations.data[i].lat);
			$newLocation.accordion.header.attr("lng", locations.data[i].lng);

			//push individual div to global array
			locationsGlobal.push($newLocation);

			//append the div we just constructed and popuated to the side bar
			$(".my-side-bar").append($newLocation.accordion.container);
			$(".my-side-bar").append($newLocation.accordion.body);

		}//end of loop

	}


	function renderPins(map, locations) {

		for(i = 0; i < locations.data.length; i++) {
			var position = new google.maps.LatLng(locations.data[i].lat, locations.data[i].lng);

	                marker = new google.maps.Marker({
	                	position: position,
	                	map: map,
	                	animation: google.maps.Animation.DROP,
	                	title: locations.data[i].name
	                });
					Arrmarkers.push(marker)
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

	//removed unselected elements, then execute the callback
	function filterSelectedLocations(cb) {

	 var $selected = $(".accordion").filter(function(idx, ele) {
			if ($(ele).hasClass('location-selected')) {
					return true
				}
				else {
					$(ele).fadeOut("medium", function(){
						$(ele).remove();
					})
					return false
				}
			})

		cb($selected)

	}

	function renderTrip(arrLocs) {

    var orig = arrLocs.first()
    var dest = arrLocs.last();
		arrLocs.each(function(idx, ele) {
			if ( idx === 0 || idx === arrLocs.length -1 ) {
				arrLocs.splice(idx, 1)
			}
		})

		var request = {
				origin: { lat: parseFloat(orig.attr("lat")), lng: parseFloat(orig.attr("lng"))},
			  destination: { lat: parseFloat(dest.attr("lat")), lng: parseFloat(dest.attr("lng"))},
				waypoints: arrLocs.map(function(idx, ele){
				  return { location: {lat: parseFloat(ele.getAttribute("lat")), lng: parseFloat(ele.getAttribute("lng")) }, stopover: true }
				}).toArray(),
				travelMode: google.maps.TravelMode["WALKING"]
		}

		directionsService.route(request, function(response, status) {
				if(status == "OK") {
						directionsDisplay.setDirections(response);
						console.log(response);
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

