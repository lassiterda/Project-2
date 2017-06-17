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

$(document).ready(function() {

    //initializes home page
    initHome();

    //it is assumed that if this click event triggers, the btn is not disabled anymore
    $("#my-trips-btn").on("click", function() {

        //prevents the element's default behavior from triggering
        event.preventDefault();

        var btn = $("#my-trips-btn");

        //if the button reads "My Trips" re-render side bar and change its text to "Locations"
        if (btn.text() === "My Trips") {

            //makes the AJAX call and calls the functions that renders side bar with trips data
            getMyTrips();
            btn.text('Locations');

        } //otherwise do the opposite
        else if (btn.text() === "Locations") {
            //makes the AJAX call and calls the functions that renders side bar with locations data
            getLocations();
            btn.text("My Trips");
        }

    }); //end of click-event

    $('.location-box').on('click', function() {

        $('this').removeClass('location-box');
        $('this').addClass('location-box-active');
    }); //end of click-event

    $('#add-location-btn').on('click', function() {

        //prevents the element's default behavior from triggering
        event.preventDefault();
        addLocation();
    }); //end of click-event

    $('#build-trip-btn').on('click', function() {

        if ($(".location-selected").length < 2) {
            console.log();
        } else {
            filterSelectedLocations(function($selected) {

                var list = document.getElementById("accordion");
                Sortable.create(list, {
                    onSort: function(evt) {
                        filterSelectedLocations(function($selected) {
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


    }); //end of click-event

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

    $(document).on("click", ".location-render", function(event) {
      event.preventDefault();
      clearMarkers();

      var tripId = parseInt(event.target.parentNode.getAttribute("trip-id"))
      var matchingTrip = myTripsGlobal.filter(function(trip){ return trip.id === tripId})[0]

      renderTrip(matchingTrip.Locations)
    })
    // =============== End of Program Logic ===============
}) //end of document.ready

// =============== FUNCTIONS ===============

function initHome() {

    //enables My Trips button is there is at least one trip in database
    areThereTrips();

    var currentURL = window.location.origin;

    //API call to the server to retrieve locations data
    $.get(currentURL + "/api/location")
        .done(function(data) {

            const Charlotte = {
                center: {
                    lat: 35.22,
                    lng: -80.84
                },
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

} //end of initHome

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

} //end of areThereTrips

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

} //end of showMyTrips

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
    $(".my-side-bar").empty();
    myTripsGlobal = []
    if(apiTrips.length === 0) {

    }
    else {
      for (i = 0; i < apiTrips.length; i++) {
        //push individual trip to global array
        myTripsGlobal.push(apiTrips[i]);
          //setting properties to the object
          $newTrip = {
              accordion: {
                  container: $("<div />"),
                  header: $('<button />').addClass('accordion').attr("trip-id", apiTrips[i].id),
                  selectAdd: $('<img />').attr("src", "/assets/icons/core/plus-circle.svg").addClass("select-add").css("float", "right"),
                  body: $('<div />').addClass('panel'),
                  list: $('<ol />').attr("type", "A")
              }
          };

          $newTrip.accordion.header.append("<a href='#' class='location-render'>" + apiTrips[i].name + "</a>")
          $newTrip.accordion.header.append($newTrip.accordion.selectAdd);

          //could this be a for each...? or jQuery .each()?
          apiTrips[i].Locations.forEach(function(loc) {
            var $li = $("<li>")
            $li.text(loc.name);
            $newTrip.accordion.list.append($li);
            $newTrip.accordion.list.append('<p class="location-address">' + loc.address + '</p>');

          })
          $newTrip.accordion.list.append('<h6>' + 'Total Time: ' + '</h6>');

          $newTrip.accordion.body.append($newTrip.accordion.list);



          //append the div we just constructed and popuated to the side bar
          $newTrip.accordion.container.append($newTrip.accordion.header)
          $(".my-side-bar").append($newTrip.accordion.container);
          $(".my-side-bar").append($newTrip.accordion.body);
      }
  }
}

// Populates the sideBar with Locations retreived from the db.
function renderSideBarWithLocations(locations) {

    //emptying the side bar before re-populating it
    $(".my-side-bar").empty();

    for (i = 0; i < locations.data.length; i++) {
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
        $newLocation.accordion.body.append("<p class='location-address'>"+ $newLocation.about.address.street + "</p>").append('<p>' + locations.data[i].description + '</p>');
        $newLocation.accordion.container.append($newLocation.accordion.header)
        $newLocation.accordion.container.append($newLocation.accordion.panel)
        $newLocation.accordion.header.append($newLocation.accordion.selectAdd)

        $newLocation.accordion.header.attr("location-id", locations.data[i].id);
        $newLocation.accordion.header.attr("lat", locations.data[i].lat);
        $newLocation.accordion.header.attr("lng", locations.data[i].lng);

        //push individual div to global array
        locationsGlobal.push($newLocation);

        //append the div we just constructed and popuated to the side bar
        $(".my-side-bar").append($newLocation.accordion.container);
        $(".my-side-bar").append($newLocation.accordion.body);


    } //end of loop

}

function renderPins(map, locations) {

    for (i = 0; i < locations.data.length; i++) {
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
            category: $("#category-input").val().trim(),
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

//remove unselected elements, then execute the callback
function filterSelectedLocations(cb) {

    var $selected = $(".accordion").filter(function(idx, ele) {
        if ($(ele).hasClass('location-selected')) {
            return true
        } else {
            $(ele).fadeOut("medium", function() {
                $(ele).remove();
            })
            return false
        }
    })

    cb($selected)

}

function renderTrip(arrLocs) {
  //if arrlocs is Jquery 'array'
  if(arrLocs instanceof jQuery) {
    var orig = arrLocs.first()
    var dest = arrLocs.last();
    arrLocs.each(function(idx, ele) {
        if (idx === 0 || idx === arrLocs.length - 1) {
            arrLocs.splice(idx, 1)
        }
    })

    var request = {
        origin: {
            lat: parseFloat(orig.attr("lat")),
            lng: parseFloat(orig.attr("lng"))
        },
        destination: {
            lat: parseFloat(dest.attr("lat")),
            lng: parseFloat(dest.attr("lng"))
        },
        waypoints: arrLocs.map(function(idx, ele) {
            return {
                location: {
                    lat: parseFloat(ele.getAttribute("lat")),
                    lng: parseFloat(ele.getAttribute("lng"))
                },
                stopover: true
            }
        }).toArray(),
        travelMode: google.maps.TravelMode["WALKING"]
    }
  }

  else {
    console.log(arrLocs);
    var origin = arrLocs.shift()
    var destination = arrLocs.pop();

    var request = {
      origin: {
          lat: parseFloat(origin.lat),
          lng: parseFloat(origin.lng)
        },
      destination: {
          lat: parseFloat(destination.lat),
          lng: parseFloat(destination.lng)
        },
      waypoints: arrLocs.map(function(loc) {
          return {
              location: {
                lat: parseFloat(loc.lat),
                lng: parseFloat(loc.lng)},
              stopover: true
            }
      }),
      travelMode: google.maps.TravelMode["WALKING"]
    }
    console.log(request);
  }

    directionsService.route(request, function(response, status) {
        if (status == "OK") {
            directionsDisplay.setDirections(response);
            console.log(response);
        }
    });

}

function clearMarkers() {
    setMapOnAll(null);
}

function setMapOnAll(map) {
    for (var i = 0; i < Arrmarkers.length; i++) {
        Arrmarkers[i].setMap(map);
    }
}
