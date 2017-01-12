

const apiUrl = 'http://localhost:3000/api';

function init() {
  $('.registration').on('click', registerForm);
  $('.login').on('click', loginForm);
  $('.logout').on('click', logOut);
  $('body').on('submit', 'form', submittedForm);
  if (getToken()) {
    loggedInState();
  } else {
    loggedOutState();
  }
  // initMap();
}

function registerForm(e) {
  e.preventDefault();
  $('.main').show().html(`
    <h4>Registration form</h4>
    <div class="row">
      <form  method="post" action="/register" class="col s12">
        <div class="row">
          <div class="input-field col s12">
          <input id="user_name" type="text" class="validate" name="user[username]">
          <label for="user_name">Username</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
          <input id="email" type="email" class="validate" name="user[email]">
          <label for="email">Email</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
          <input id="password" type="password" class="validate" name="user[password]">
          <label for="password">Password</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
          <input id="password-confirm" type="password" class="validate" name="user[passwordConfirmation]">
          <label for="password-confirm">Confirm password</label>
          </div>
        </div>
        <button class="btn waves-effect waves-light" type="submit" name="action">Register</button>
      </form>
    </div>`);
}

function loginForm(e) {
  if (e) e.preventDefault();

  $('.main').show().html(`
    <h4>Log in</h4>
    <div class="row">
      <form method="post" action="/login" class="col s12">
        <div class="row">
          <div class="input-field col s12">
          <input id="email" type="email" class="validate" name="email">
          <label for="email">Email</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
          <input id="password" type="password" class="validate" name="password">
          <label for="password">Password</label>
          </div>
        </div>
        <button class="btn waves-effect waves-light" type="submit" name="action">Log in</button>
      </form>
    </div>`);
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
  });
  $('.main').hide();
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
}

$(init);
