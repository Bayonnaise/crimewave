function initialize() {
  geocoder = new google.maps.Geocoder();
  myLatLng = new google.maps.LatLng(51.523076, -0.087065);

  var mapOptions = {
    center: myLatLng,
    zoom: 14,
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

function addressToCoords() {
  var newAddress = document.getElementById("postcode").value;
  geocoder.geocode({'address': newAddress}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      myLatLng = results[0].geometry.location
      map.setCenter(myLatLng);

      var marker = new google.maps.Marker({
        animation: google.maps.Animation.BOUNCE,
        position: myLatLng
      });
      markers.push(marker);

      var circle = new google.maps.Circle({
        center: myLatLng,
        radius: 1600,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.1
      });
      circles.push(circle);

      fetchCrimes();
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function fetchCrimes() {
  var url = 'http://data.police.uk/api/crimes-street/all-crime?lat=' + myLatLng.lat() + '&lng=' + myLatLng.lng();
  var chosenCrime = $('input[name="crime-type"]:checked').val();

  $.get(url, function(crimes){
    crimes.forEach( function(crime) {
      if (crime.category === chosenCrime) {
        var pos = new google.maps.LatLng(crime.location.latitude, crime.location.longitude);
        var marker = new google.maps.Marker({
          position: pos,
        });
        markers.push(marker);
      };
    }); 
    placeMarkers();
    placeCircles();
  });
};

function placeMarkers() {
  markers.forEach (function (marker) {
    marker.setMap(map);
  });
};

function clearMarkers() {
  markers.forEach (function (marker) {
    marker.setMap(null);
  });
  markers = [];
};

function placeCircles() {
  circles.forEach (function (circle) {
    circle.setMap(map);
  });
};

function clearCircles() {
  circles.forEach (function (circle) {
    circle.setMap(null);
  });
  circles = [];
};
