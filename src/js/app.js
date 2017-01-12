function init() {
  $('.registration').on('click', registerForm);
  $('.login').on('click', loginForm);
}

function registerForm(e) {
  e.preventDefault();
  $('.main').html(`
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
  $('.main').html(`
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



$(init);
