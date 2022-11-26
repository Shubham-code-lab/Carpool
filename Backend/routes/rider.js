const express = require('express');
const {body} = require('express-validator/check');
const rider = require('../controllers/rider.js');
const auth = require('../middleware/is-auth.js');

const router = express.Router();

router.get('/getTrips', rider.getTrips);

module.exports = router;