
// google maps
let map;
let service;
let infoWindow;
let prisonMarkers = [];
let newPrisonsListener;
const prisonObject = {};
const google = google;

function initMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(51.519132, -0.094205),
    zoom: 11
  });
  showPrisons();
  newPrisonsListener = map.addListener('center_changed', newPrisons);
  function newPrisons() {
    window.setTimeout(function() {
      showPrisons();
    }, 200);
  }
  $('.trains').on('click', showTrains);
  $('.airports').on('click', showAirports);

}

function showPrisons() {
  const request = {
    location: map.getCenter(),
    radius: '50000',
    query: 'prison'
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, searchForPrison);
}

function searchForPrison(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var prison = results[i];
      // console.log(prison.name);
      // console.log(prison.formatted_address);
      createMarkerPrison(prison, map);
    }
  }
}

function createMarkerPrison(prison, map) {
  const marker = new google.maps.Marker({
    position: prison.geometry.location,
    map: map,
    icon: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-32.png'
  });
  prisonMarkers.push(marker);
  marker.addListener('click', () => {
    map.setCenter(marker.getPosition());
  });
  infoWindowPrison(prison, marker);
}

function infoWindowPrison(prison, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof infoWindow !== 'undefined') infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      content: `<h4>${prison.name}</h4>
                <p>${prison.formatted_address}</p>
                <button class="myPrison waves-effect waves-teal btn-flat">Escape from here</button>`
    });
    infoWindow.open(map, marker);
    $('body').on('click', '.myPrison', () => {
      map.setZoom(15);
      infoWindow.close();
      clearMarkers();
      createMarkerPrison(prison, map);
      google.maps.event.removeListener(newPrisonsListener);
      getPrisonLatLng(prisonObject.address);
      prisonObject.address = prison.formatted_address;
      console.log(prisonObject);
    });
  });
}

function getPrisonLatLng(address) {
  const addressFormatted = address.split(' ').join('+');
  console.log(addressFormatted);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressFormatted}&key=AIzaSyDXaR7rUFJyMSNs2AIRsKRiwvNVTso_8lY`;
  $.ajax(url).done(data => {
    // console.log(data.results[0].geometry.location);
    prisonObject.lat = data.results[0].geometry.location.lat;
    prisonObject.lng = data.results[0].geometry.location.lng;
  });
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  prisonMarkers.forEach((marker) => {
    marker.setMap(map);
    prisonMarkers = [];
  });
}


// train stations

function showTrains() {
  const request = {
    location: map.getCenter(),
    radius: '50000',
    query: 'rail station'
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, searchForStations);
}

function searchForStations(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var station = results[i];
      createMarkerStation(station, map);
    }
  }
}

function createMarkerStation(station, map) {
  const marker = new google.maps.Marker({
    position: station.geometry.location,
    map,
    icon: 'https://cdn3.iconfinder.com/data/icons/mapicons/icons/steamtrain.png'
  });
  infoWindowStation(station, marker);
}

function infoWindowStation(station, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof infoWindow !== 'undefined') infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      content: `<h4>${station.name}</h4>`
    });
  });
}


// airports
function showAirports() {

}

$(initMap);
