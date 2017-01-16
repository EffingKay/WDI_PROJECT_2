const express = require('express');
const router = express.Router();

const authentication = require('../controllers/authentications');
const users          = require('../controllers/users');


router.route('/register')
  .post(authentication.register);
router.route('/login')
  .post(authentication.login);

router.route('/users')
  .get(users.index);

module.exports = router;
