const apiUrl = 'http://localhost:3000/api';

function init() {
  $('.registration').on('click', registerForm);
  $('.login').on('click', loginForm);
  $('.logout').on('click', logOut);
  $('body').on('submit', 'form', submittedForm);
  $('.users').on('click', usersIndex);
  $('body').on('click', '.backToMap', closeForms);
  $('.button-collapse').sideNav({
    menuWidth: 500, // Default is 240
    edge: 'right', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true // Choose whether you can drag to open on touch screens
  });
  if (getToken()) {
    loggedInState();
  } else {
    loggedOutState();
  }
  // initMap();
}

function registerForm(e) {
  e.preventDefault();
  $('.tabs').hide();
  $('#registrationModal').modal();
}

function loginForm(e) {
  if (e) e.preventDefault();
  $('.tabs').hide();
  $('#loginModal').modal();
}

function submittedForm(e) {
  if (e) e.preventDefault();
  $.ajax({
    url: `${apiUrl}${$(this).attr('action')}`,
    method: $(this).attr('method'),
    data: $(this).serialize(),
    beforeSend: setRequestHeader
  }).done((data) => {
    if (data.token) setToken(data.token);
    loggedInState();
    setUser(data.user.username, data.user.email);
  });
  $('.main').hide();
  $('#map-canvas').show();
  $('.modal').modal('close');
}

function setUser(username, email) {
  window.localStorage.setItem('username', username);
  window.localStorage.setItem('email', email);
}

function setToken(token) {
  return window.localStorage.setItem('token', token);
}

function setRequestHeader(xhr) {
  return xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
}

function getToken() {
  return window.localStorage.getItem('token');
}

function removeToken() {
  return window.localStorage.clear();
}

function loggedInState() {
  $('.loggedIn').show();
  $('.loggedOut').hide();
}

function loggedOutState() {
  $('.loggedIn').hide();
  $('.loggedOut').show();
}

function logOut(e) {
  e.preventDefault();
  loggedOutState();
  loginForm();
  removeToken();
  $('.tab').hide();
  $('.button-collapse').sideNav('hide');
}

function closeForms() {
  $('.modal').modal('close');
}

function getUsername() {
  return  window.localStorage.getItem('username');
}

function getEmail() {
  return  window.localStorage.getItem('email');
}

function usersIndex(e) {
  if (e) e.preventDefault();
  const username = getUsername();
  const email = getEmail();
  const url = `${apiUrl}/users`;
  return $.ajax({
    url,
    method: 'GET',
    beforeSend: setRequestHeader
  }).done(data => {
    $('.main').hide();
    $('.userList').html('').append(`
      <li><div class="userView">
        <div class="background">
          <img src="/images/side-bg.jpg">
        </div>
        <img class="circle" src="https://cdn3.iconfinder.com/data/icons/ballicons-free/128/wooman.png">
        <a href="#!name"><span id="usernameSlide" class="black-text name">${username}</span></a>
        <a href="#!email"><span id="emailSlide" class="black-text email">${email}</span></a>
      </div></li>
      <li><a class="subheader">My profile</a></li>
      <li><a href="#!">Edit</a></li>
      <li><div class="divider"></div></li>
      <li><a class="subheader">Other escapees</a></li>
      `);
    $.each(data.users, (index, user) => {
      $('.userList').append(`
        <li><a class="waves-effect" href="#!">${user.username}</a></li>
      `);
    });
  });
}
$(init);
