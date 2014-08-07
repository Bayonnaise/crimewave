function initialize() {
  geocoder = new google.maps.Geocoder();
  myLatLng = new google.maps.LatLng(51.523076, -0.087065);

  var mapOptions = {
    center: myLatLng,
    zoom: 14
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  var marker = new google.maps.Marker({
    animation: google.maps.Animation.BOUNCE,
    position: myLatLng,
    map: map
  });
  markers.push(marker);
}

function addressToCoords() {
  var newAddress = document.getElementById("postcode").value;
  geocoder.geocode({'address': newAddress}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      myLatLng = results[0].geometry.location;
      map.setCenter(myLatLng);

      var marker = new google.maps.Marker({
        animation: google.maps.Animation.BOUNCE,
        position: myLatLng,
        map: map
      });
      markers.push(marker);

      placeCircle(myLatLng);

      fetchCrimes();
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function placeCircle(center) {
  var circle = new google.maps.Circle({
    center: center,
    radius: 1600,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.1,
    map: map
  });
  circles.push(circle);
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
          map: map
        });
        markers.push(marker);
      };
    }); 
  });
};

function placeAll(mapElements) {
  mapElements.forEach (function (element) {
    element.setMap(map);
  });
};

function clearAll(mapElements) {
  mapElements.forEach (function (element) {
    element.setMap(null);
  });
  mapElements.length = 0;
};
