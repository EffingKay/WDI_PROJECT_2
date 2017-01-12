
// google maps
let map;
let service;
let infoWindow;

const google = google;
function initMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(51.519132, -0.094205),
    zoom: 11
  });
  showPrisons();
  map.addListener('center_changed', function() {
    window.setTimeout(function() {
      showPrisons();
    }, 200);
  });
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
      console.log(prison.name);
      console.log(prison.formatted_address);
      createMarkerPrison(prison);
    }
  }
}

function createMarkerPrison(prison) {
  const marker = new google.maps.Marker({
    position: prison.geometry.location,
    map: map
  });
  marker.addListener('click', () => {
    map.setZoom(14);
    map.setCenter(marker.getPosition());
  });
  infoWindowPrison(prison, marker);
}

function infoWindowPrison(prison, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof infoWindow !== 'undefined') infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      content: `<h4>${prison.name}</h4><p>${prison.formatted_address}`
    });
    infoWindow.open(map, marker);
    // this.map.setCenter(marker.getPosition());
  });
}








// log in and log out
//
// const apiUrl = 'http://localhost:3000/api';
//
// function init() {
//   $('.registration').on('click', registerForm);
//   $('.login').on('click', loginForm);
//   $('.logout').on('click', logOut);
//   $('body').on('submit', 'form', submittedForm);
//   if (getToken()) {
//     loggedInState();
//   } else {
//     loggedOutState();
//   }
//   initMap();
// }
//
// function registerForm(e) {
//   e.preventDefault();
//   $('.main').html(`
//     <h4>Registration form</h4>
//     <div class="row">
//       <form  method="post" action="/register" class="col s12">
//         <div class="row">
//           <div class="input-field col s12">
//           <input id="user_name" type="text" class="validate" name="user[username]">
//           <label for="user_name">Username</label>
//           </div>
//         </div>
//         <div class="row">
//           <div class="input-field col s12">
//           <input id="email" type="email" class="validate" name="user[email]">
//           <label for="email">Email</label>
//           </div>
//         </div>
//         <div class="row">
//           <div class="input-field col s12">
//           <input id="password" type="password" class="validate" name="user[password]">
//           <label for="password">Password</label>
//           </div>
//         </div>
//         <div class="row">
//           <div class="input-field col s12">
//           <input id="password-confirm" type="password" class="validate" name="user[passwordConfirmation]">
//           <label for="password-confirm">Confirm password</label>
//           </div>
//         </div>
//         <button class="btn waves-effect waves-light" type="submit" name="action">Register</button>
//       </form>
//     </div>`);
// }
//
// function loginForm(e) {
//   if (e) e.preventDefault();
//   $('.main').html(`
//     <h4>Log in</h4>
//     <div class="row">
//       <form method="post" action="/login" class="col s12">
//         <div class="row">
//           <div class="input-field col s12">
//           <input id="email" type="email" class="validate" name="email">
//           <label for="email">Email</label>
//           </div>
//         </div>
//         <div class="row">
//           <div class="input-field col s12">
//           <input id="password" type="password" class="validate" name="password">
//           <label for="password">Password</label>
//           </div>
//         </div>
//         <button class="btn waves-effect waves-light" type="submit" name="action">Log in</button>
//       </form>
//     </div>`);
// }
//
// function submittedForm(e) {
//   if (e) e.preventDefault();
//   $.ajax({
//     url: `${apiUrl}${$(this).attr('action')}`,
//     method: $(this).attr('method'),
//     data: $(this).serialize(),
//     beforeSend: setRequestHeader
//   }).done((data) => {
//     if (data.token) setToken(data.token);
//     loggedInState();
//   });
//   $('.main').hide();
// }
//
// function setToken(token) {
//   return window.localStorage.setItem('token', token);
// }
//
// function setRequestHeader(xhr) {
//   return xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
// }
//
// function getToken() {
//   return window.localStorage.getItem('token');
// }
//
// function removeToken() {
//   return window.localStorage.clear();
// }
//
// function loggedInState() {
//   $('.loggedIn').show();
//   $('.loggedOut').hide();
// }
//
// function loggedOutState() {
//   $('.loggedIn').hide();
//   $('.loggedOut').show();
// }
//
// function logOut(e) {
//   e.preventDefault();
//   loggedOutState();
//   loginForm();
//   removeToken();
// }
//



$(initMap);
