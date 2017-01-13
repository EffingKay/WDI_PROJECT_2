"use strict";function initMap(){function n(){window.setTimeout(function(){showPrisons()},200)}map=new google.maps.Map(document.getElementById("map-canvas"),{center:new google.maps.LatLng(51.519132,(-.094205)),zoom:11}),showPrisons(),newPrisonsListener=map.addListener("center_changed",n),$(".tabs").hide(),$(".trains").on("click",showTrains),$(".airports").on("click",showAirports),$(".journey").on("click",journeyPlanner)}function showPrisons(){var n={location:map.getCenter(),radius:"50000",query:"prison"};service=new google.maps.places.PlacesService(map),service.textSearch(n,searchForPrison)}function searchForPrison(n,o){if(o===google.maps.places.PlacesServiceStatus.OK)for(var e=0;e<n.length;e++){var t=n[e];createMarkerPrison(t,map)}}function createMarkerPrison(n,o){var e=new google.maps.Marker({position:n.geometry.location,map:o,icon:"https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-32.png"});prisonMarkers.push(e),e.addListener("click",function(){o.setCenter(e.getPosition())}),infoWindowPrison(n,e)}function infoWindowPrison(n,o){google.maps.event.addListener(o,"click",function(){"undefined"!=typeof infoWindow&&infoWindow.close(),infoWindow=new google.maps.InfoWindow({content:"<h4>"+n.name+"</h4>\n                <p>"+n.formatted_address+'</p>\n                <button class="myPrison waves-effect waves-teal btn-flat">Escape from here</button>'}),infoWindow.open(map,o),$("#map-canvas").on("click",".myPrison",function(){clearMarkers(),map.setZoom(15),infoWindow.close(),clearMarkers(),google.maps.event.removeListener(newPrisonsListener),prisonObject.address=n.formatted_address,getPrisonLatLng(prisonObject.address),$(".tabs").show(),createMarkerPrison(n,map)})})}function getPrisonLatLng(n){prisonObject.addressFormatted=n.split(" ").join("+");var o="https://maps.googleapis.com/maps/api/geocode/json?address="+prisonObject.addressFormatted+"&key=AIzaSyDXaR7rUFJyMSNs2AIRsKRiwvNVTso_8lY";$.ajax(o).done(function(n){prisonObject.lat=n.results[0].geometry.location.lat,prisonObject.lng=n.results[0].geometry.location.lng})}function clearMarkers(){setMapOnAll(null)}function setMapOnAll(n){prisonMarkers.forEach(function(o){o.setMap(n),prisonMarkers=[]})}function showTrains(){var n={location:{lat:prisonObject.lat,lng:prisonObject.lng},radius:"50000",query:"rail station"};service=new google.maps.places.PlacesService(map),service.textSearch(n,searchForStations),map.setCenter(new google.maps.LatLng(prisonObject.lat,prisonObject.lng)),map.setZoom(12),$(".trains").html("Hide trains")}function searchForStations(n,o){if(o===google.maps.places.PlacesServiceStatus.OK)for(var e=0;e<n.length;e++){var t=n[e];createMarkerStation(t,map)}}function createMarkerStation(n,o){var e=new google.maps.Marker({position:n.geometry.location,map:o,icon:"https://cdn3.iconfinder.com/data/icons/mapicons/icons/steamtrain.png"});infoWindowStation(n,e)}function infoWindowStation(n,o){google.maps.event.addListener(o,"click",function(){"undefined"!=typeof infoWindow&&infoWindow.close(),infoWindow=new google.maps.InfoWindow({content:"<h4>"+n.name+'</h4>\n                <button class="destination waves-effect waves-teal btn-flat">get here</button>'}),infoWindow.open(map,o),$("#map-canvas").on("click",".destination",function(){destination.location=o.getPosition(),journeyPlanner()})})}function showAirports(){var n="https://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?apikey=yGCL11tesreUoG0MGKkjSYqMsAMwEju3&latitude="+prisonObject.lat+"&longitude="+prisonObject.lng;$.ajax(n).done(function(n){n.forEach(function(n){console.log(n),createMarkerAirport(n,map),map.setZoom(9)})})}function createMarkerAirport(n,o){var e={lat:n.location.latitude,lng:n.location.longitude},t=new google.maps.Marker({position:e,map:o,icon:"https://cdn4.iconfinder.com/data/icons/aiga-symbol-signs/612/aiga_air_transportation_bg-32.png"});infoWindowAirport(n,t)}function infoWindowAirport(n,o){google.maps.event.addListener(o,"click",function(){"undefined"!=typeof infoWindow&&infoWindow.close(),infoWindow=new google.maps.InfoWindow({content:"<h4>"+n.airport_name+"</h4>\n                <h6>Distance: "+n.distance+" km</h6>\n                <h6>Aircraft movements: "+n.aircraft_movements+'</h6>\n                <button id="'+n.airport_name+'" class="destination waves-effect waves-teal btn-flat">get here</button>'}),infoWindow.open(map,o),$("#map-canvas").on("click",".destination",function(){destination.location="",destination.location=o.getPosition(),journeyPlanner()})})}function journeyPlanner(){function n(n,o){n.route({origin:prisonObject.lat+","+prisonObject.lng,destination:destination.location,travelMode:"DRIVING"},function(n,e){"OK"===e?o.setDirections(n):window.alert("Directions request failed due to "+e)})}var o=new google.maps.DirectionsService,e=new google.maps.DirectionsRenderer;e.setMap(map),n(o,e),clearMarkers(),infoWindow.close()}var map=void 0,service=void 0,infoWindow=void 0,prisonMarkers=[],trainMarkers=[],newPrisonsListener=void 0,prisonObject={},destination={},google=google;$(initMap);