function initMap() {

var locations = [
  {
    position: {lat: 35.08, lng: -80.89},
    animation: google.maps.Animation.DROP,
    title: "Pineville"

  },
  {
    position: {lat: 35.32, lng: -80.75},
    animation: google.maps.Animation.DROP,
    title: 'University Area'
  },
  {
    position: {lat: 35.12, lng: -80.72},
    animation: google.maps.Animation.DROP,
    title: 'Matthews'
  },
  {
    position: {lat: 35.05, lng: -80.85},
    animation: google.maps.Animation.DROP,
    title: 'Ballantyne'
  },
  {
    position: {lat: 35.25, lng: -80.80},
    animation: google.maps.Animation.DROP,
    title: 'NoDa'
  },
  {
    position: {lat: 35.41, lng: -80.84},
    animation: google.maps.Animation.DROP,
    title: 'Huntersville'
  },
  {
    position: {lat: 35.08, lng: 80.67},
    animation: google.maps.Animation.DROP,
    title: 'Indian Trail'
  }
];
        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('map-location'), {
          center: {lat: 35.22, lng: -80.84},
          scrollwheel: false,
          zoom: 10
        });
        // Create a marker and set its position.
        var myLatLng = {lat: 35.23, lng: -80.85};
        var marker = new google.maps.Marker({
          map: map,
          position: myLatLng,
          animation: google.maps.Animation.DROP,
          title: 'Walkabout CLT'
        });

        renderPins(map, locations);
      }

function renderPins(map, locations) {


  for (var i = 0; i <= locations.length; i++) {
    var newPin = new google.maps.Marker({
      map: map,
      position: locations[i].position,
      animation: google.maps.Animation.DROP,
      title: locations[i].title

    });
  };

}




initMap();

