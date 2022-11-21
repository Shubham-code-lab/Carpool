const express = require('express');
const {body} = require('express-validator/check');
const driver = require('../controllers/driver.js');
const auth = require('../middleware/is-auth.js');

const router = express.Router();

router.post('/addVehical', auth, driver.addVehicals);

module.exports = router;