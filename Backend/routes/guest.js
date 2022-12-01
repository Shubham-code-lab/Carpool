const express = require('express');
const {body} = require('express-validator/check');
const guest = require('../controllers/guest.js');

const router = express.Router();

router.post('/getTrips', guest.getTrips);

router.post('/getTripDetail', guest.getTripDetail);

module.exports = router;