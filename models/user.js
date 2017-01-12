const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, unique: true, required: true }
});

userSchema.methods.validatePassword = validatePassword;

userSchema.virtual('password').set(setPassword);
userSchema.virtual('passwordConfirmation').set(setPasswordConfirmation);

userSchema.path('passwordHash').validate(validatePasswordHash);
userSchema.path('email').validate(validateEmail);


function validatePassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
}

function setPassword(password) {
  this._password = password;
  this.passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

function setPasswordConfirmation(passwordConfirmation) {
  this._passwordConfirmation = passwordConfirmation;
}

function validatePasswordHash() {
  if (this.isNew) {
    if (!this._password) {
      return this.invalidate('password', 'A password is required.');
    }
    if (this._password.length < 6) {
      return this.invalidate('password', 'Password must be at least 6 characters.');
    }
    if (this._password !== this._passwordConfirmation) {
      return this.invalidate('password', 'Passwords do not match.');
    }
  }
}

function validateEmail(email) {
  if (!validator.isEmail(email)) {
    return this.invalidate('email', 'A valid e-mail address is required.');
  }
}


module.exports = mongoose.model('User', userSchema);
