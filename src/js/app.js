
// google maps
let map;
let service;
let infoWindow;
let prisonMarkers = [];
const stationMarkers = [];
const airportMarkers = [];
let newPrisonsListener;
const prisonObject = {};
const destination = {};
const google = google;
let directionsService;
let directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});

function initMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(51.519132, -0.094205),
    zoom: 9,
    styles: [{"stylers":[{"visibility":"on"},{"saturation":-100},{"gamma":0.54}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#4d4946"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"gamma":0.48}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"gamma":7.18}]}]
    // styles: [{"stylers":[{"visibility":"on"},{"saturation":-100},{"gamma":0.54}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#4d4946"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"gamma":0.48}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"gamma":7.18}]}]
  });
  showPrisons();
  hideStations();
  hideAirports();
  newPrisonsListener = map.addListener('center_changed', newPrisons);
  function newPrisons() {
    window.setTimeout(function() {
      showPrisons();
    }, 200);
  }
  $('.tabs').hide();
  $('.brand-logo').on('click', initMap);
  $('.tabs').on('click', '.showTrains', showTrains);
  $('.tabs').on('click', '.hideTrains', hideStations);
  $('.tabs').on('click', '.showAirports', showAirports);
  $('.tabs').on('click', '.hideAirports', hideAirports);
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
    $('#map-canvas').on('click', '.myPrison', () => {
      map.setZoom(15);
      infoWindow.close();
      google.maps.event.removeListener(newPrisonsListener);
      prisonObject.address = prison.formatted_address;
      getPrisonLatLng(prisonObject.address);
      $('.tabs').show();
      clearMarkers();
      createMarkerPrison(prison, map);
      showPolice(prison);
    });
  });
}

function getPrisonLatLng(address) {
  prisonObject.addressFormatted = address.split(' ').join('+');
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${prisonObject.addressFormatted}&key=AIzaSyDXaR7rUFJyMSNs2AIRsKRiwvNVTso_8lY`;
  $.ajax(url).done(data => {
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
  });
}


// train stations
function showTrains() {
  const request = {
    location: {lat: prisonObject.lat, lng: prisonObject.lng},
    radius: '50000',
    query: 'rail station'
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, searchForStations);
  map.setCenter(new google.maps.LatLng(prisonObject.lat, prisonObject.lng));
  map.setZoom(12);
  $('.trains').addClass('hideTrains').removeClass('showTrains').html('hide trains');
}

function searchForStations(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var station = results[i];
      createMarkerStation(station, map);
    }
  }
}

function hideStations() {
  stationMarkers.forEach(station => {
    station.setMap(null);
  });
  $('.trains').removeClass('hideTrains').addClass('showTrains').html('show trains');
}

function createMarkerStation(station, map) {
  const marker = new google.maps.Marker({
    position: station.geometry.location,
    map: map,
    icon: 'https://cdn3.iconfinder.com/data/icons/mapicons/icons/steamtrain.png'
  });
  infoWindowStation(station, marker);
  stationMarkers.push(marker);
}

function infoWindowStation(station, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof infoWindow !== 'undefined') infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      content: `<h4>${station.name}</h4>
                <button class="destination waves-effect waves-teal btn-flat">get here</button>`
    });
    infoWindow.open(map, marker);
    $('.destination').on('click', () => {
      destination.location = marker.getPosition();
      destination.lat = marker.getPosition().lat();
      destination.lng = marker.getPosition().lng();
      journeyPlanner(destination.location);
    });
  });
}


// airports
function showAirports() {
  const url = `https://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?apikey=yGCL11tesreUoG0MGKkjSYqMsAMwEju3&latitude=${prisonObject.lat}&longitude=${prisonObject.lng}`;
  $.ajax(url).done(data => {
    data.forEach(airport => {
      console.log(airport);
      createMarkerAirport(airport, map);
      map.setZoom(9);
    });
  });
  $('.airports').addClass('hideAirports').removeClass('showAirports').html('hide airports');

}

function createMarkerAirport(airport, map) {
  const latLng = {lat: airport.location.latitude, lng: airport.location.longitude};
  const marker = new google.maps.Marker({
    position: latLng,
    map,
    icon: 'https://cdn4.iconfinder.com/data/icons/aiga-symbol-signs/612/aiga_air_transportation_bg-32.png'
  });
  infoWindowAirport(airport, marker);
  airportMarkers.push(marker);
}

function infoWindowAirport(airport, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof infoWindow !== 'undefined') infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      content: `<h4>${airport.airport_name}</h4>
                <h6>Aircraft movements: ${airport.aircraft_movements}</h6>
                <button id="${airport.airport_name}" class="destination waves-effect waves-teal btn-flat">get here</button>`
    });
    infoWindow.open(map, marker);
    $('.destination').on('click', () => {
      destination.location = '';
      destination.location = marker.getPosition();
      destination.lat = marker.getPosition().lat();
      destination.lng = marker.getPosition().lng();
      journeyPlanner(destination.location);
    });
  });
}

function hideAirports() {
  airportMarkers.forEach(airport => {
    airport.setMap(null);
  });
  $('.airports').removeClass('hideAirports').addClass('showAirports').html('show airports');
}

// police stations
function showPolice(prison) {
  const request = {
    location: prison.geometry.location,
    radius: '50000',
    query: 'police'
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, searchForPolice);
}

function searchForPolice(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var police = results[i];
      createMarkerPolice(police, map);
    }
  }
}

function createMarkerPolice(police, map) {
  const marker = new google.maps.Marker({
    position: police.geometry.location,
    map: map,
    icon: 'https://cdn1.iconfinder.com/data/icons/windows8_icons_iconpharm/26/police.png'
  });
}


// journey planner
function journeyPlanner(destination) {
  if (directionsDisplay !== null) {
    directionsDisplay.setMap(null);
    directionsDisplay = null;
  }
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
  directionsDisplay.setMap(map);
  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: `${prisonObject.lat},${prisonObject.lng}`,
      destination,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
  calculateAndDisplayRoute(directionsService, directionsDisplay);
  infoWindow.close();
  journeyDetails();
}


function journeyDetails() {
  service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [{lat: prisonObject.lat, lng: prisonObject.lng}],
      destinations: [{lat: destination.lat, lng: destination.lng}],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      durationInTraffic: true,
      avoidHighways: false,
      avoidTolls: false
    }, responseData);
  function responseData(responseDis, status) {
    if (status !== google.maps.DistanceMatrixStatus.OK || status !== 'OK'){
      console.log('Error:', status);
    } else{
      console.log(responseDis.rows[0].elements[0].distance.text);
      console.log(responseDis);
      $('.tabs').on('click', '.journey', () => appendJourneyInfo(responseDis));
    }
  }
  function appendJourneyInfo(responseDis) {
    // rewrite with html not append
    $('nav').append(`
      <div class="journeyDetails">
        <ul class="collection">
          <li class="collection-item">
            <p class="blue-text text-darken-2">Distance: ${responseDis.rows[0].elements[0].distance.text}</p>
          </li>
        </ul>
      </div>
    `);
  }
}


$(initMap);
