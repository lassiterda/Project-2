function initMap() {
        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('map-location'), {
          center: {lat: 35.22, lng: -80.84},
          scrollwheel: false,
          zoom: 12
        });
        // Create a marker and set its position.
        var myLatLng = {lat: 35.23, lng: -80.85};
        var marker = new google.maps.Marker({
          map: map,
          position: myLatLng,
          title: 'Walkabout CLT'
        });
      }

initMap();

