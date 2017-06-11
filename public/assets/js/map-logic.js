function initMap() {
        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('map-location'), {
          center: {lat: 35.22, lng: -80.84},
          scrollwheel: false,
          zoom: 14
        });
        var infowindow = new google.maps.InfoWIndow();
        var marker;
      }

function getLocations() {
  $.get("/api/locations", function (data) {
    console.log(response.data);
    let 
  }).done(function() {
    initMap();
  })
}

getLocations();