//function to ajax and get the markers;
function getLocations() {

  $.get("/api/location")
  .done(function(response) {

    console.log(response);

    var locationsArray = response.data;

    for(i = 0; i < locationsArray.length; i++) {

      var position = new google.maps.LatLng(locationsArray[i].lat, locationsArray[i].lng);

      bounds.extend(position);

      marker = new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP,
        title: locationsArray[i].name
      });
    }

    marker.addListener('click', toggleBounce);
    marker.addListener('click', getInfo);

  })
  .fail(function(err) { console.log(err) })
}

function getInfo() {

  $.get("/api/location")
  .done(function(response) {

    var locationData = response.data;

    locationData = {
      name: locationData.name,
      desc: locationData.description,
      address: locationData.address,
      city: locationData.city,
      state: locationData.state,
      zip: locationData.zip 
    }

  })
  .fail(function(err) {console.log(err)});
}


// function to init the map, with a callback implemented
function initMap(cb) {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map-location'), {
    center: {lat: 35.22, lng: -80.84},
    scrollwheel: false,
    zoom: 14
  });
  cb();
}
//call it
initMap(getLocations)
//Need to create info window dynamically from the location
var infoWindowContent = [
['<div class="info-content">' + '<h3>Title</h3>' + '<p>Address</p>' + '<p>Description</p>' + '<p>City, State</p>' + '<input type="radio>"']
];
 // Display multiple markers on a map
 var infoWindow = new google.maps.InfoWindow(), marker, i;
 // Allow each marker to have an info window    
 google.maps.event.addListener(marker, 'click', (function(marker, i) {
  return function() {
    infoWindow.setContent(infoWindowContent[i]);
    infoWindow.open(map, marker);
  }
})(marker, i));


 function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}


function drop() {
  for (var i =0; i < markerArray.length; i++) {
    setTimeout(function() {
      addMarkerMethod();
    }, i * 200);
  }
}
//directions function
  //working on...
  function plotDirections() {
    google.maps.event.addListener(marker, 'click', function(m) {
    })
  }
//Modal stuffs
$("#add-location").on('click', function() {
  $('#myModal').modal('show');
})
$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
})


