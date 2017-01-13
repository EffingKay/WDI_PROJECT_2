
// google maps
let map;
let service;
let infoWindow;
let prisonMarkers = [];
let trainMarkers = [];
let newPrisonsListener;
const prisonObject = {};
const destination = {};
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
  $('.tabs').hide();
  $('.trains').on('click', showTrains);
  $('.airports').on('click', showAirports);
  $('.journey').on('click', journeyPlanner);
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
      clearMarkers();
      map.setZoom(15);
      infoWindow.close();
      clearMarkers();
      google.maps.event.removeListener(newPrisonsListener);
      prisonObject.address = prison.formatted_address;
      getPrisonLatLng(prisonObject.address);
      $('.tabs').show();
      createMarkerPrison(prison, map);
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
    prisonMarkers = [];
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
  $('.trains').html('Hide trains');
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
    map: map,
    icon: 'https://cdn3.iconfinder.com/data/icons/mapicons/icons/steamtrain.png'
  });
  infoWindowStation(station, marker);
}

function infoWindowStation(station, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof infoWindow !== 'undefined') infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      content: `<h4>${station.name}</h4>
                <button class="destination waves-effect waves-teal btn-flat">get here</button>`
    });
    infoWindow.open(map, marker);
    $('#map-canvas').on('click', '.destination', () => {
      destination.location = marker.getPosition();
      journeyPlanner();
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
}

function createMarkerAirport(airport, map) {
  const latLng = {lat: airport.location.latitude, lng: airport.location.longitude};
  const marker = new google.maps.Marker({
    position: latLng,
    map,
    icon: 'https://cdn4.iconfinder.com/data/icons/aiga-symbol-signs/612/aiga_air_transportation_bg-32.png'
  });
  infoWindowAirport(airport, marker);
}

function infoWindowAirport(airport, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof infoWindow !== 'undefined') infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      content: `<h4>${airport.airport_name}</h4>
                <h6>Distance: ${airport.distance} km</h6>
                <h6>Aircraft movements: ${airport.aircraft_movements}</h6>
                <button id="${airport.airport_name}" class="destination waves-effect waves-teal btn-flat">get here</button>`
    });
    infoWindow.open(map, marker);
    $('#map-canvas').on('click', '.destination', () => {
      destination.location = '';
      destination.location = marker.getPosition();
      journeyPlanner();
    });
  });
}


// car rentals

// function showCars() {
//   // ajax call to amadeus url , needing:
//   // lat and lng - prisonObject.lat && prisonObject.lng
//   // date -  pick up and drop off
//   // radius and api key
//   // https://api.sandbox.amadeus.com/v1.2/cars/search-circle?apikey=yGCL11tesreUoG0MGKkjSYqMsAMwEju3&latitude=35.1504&longitude=-114.57632&radius=42&pick_up=2016-11-07&drop_off=2016-11-08
//   const today = new Date();
//   let dd = today.getDate();
//   let mm = today.getMonth()+1; //January is 0!
//   const yyyy = today.getFullYear();
//   if(dd<10) dd='0'+dd;
//   if(mm<10) mm='0'+mm;
//   const date = `${yyyy}-${mm}-${dd}`;
//   const url = `https://api.sandbox.amadeus.com/v1.2/cars/search-circle?apikey=yGCL11tesreUoG0MGKkjSYqMsAMwEju3&latitude=${prisonObject.lat}&longitude=${prisonObject.lng}&radius=42&pick_up=${date}&drop_off=${date}`;
//   $.ajax(url).done(data => console.log(data));
// }

// journey planner
function journeyPlanner() {
  const directionsService = new google.maps.DirectionsService;
  const directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: `${prisonObject.lat},${prisonObject.lng}`,
      destination: destination.location,
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
  clearMarkers();
  infoWindow.close();

}

$(initMap);
