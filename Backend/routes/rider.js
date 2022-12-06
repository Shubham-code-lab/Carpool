const express = require('express');
const {body} = require('express-validator/check');
const rider = require('../controllers/rider.js');
const auth = require('../middleware/is-auth.js');

const router = express.Router();

router.post('/bookTrip', auth, rider.bookTrip);

router.get('/getScheduleTrips', auth, rider.getScheduleTrips);

router.put('/startTrip', auth, rider.startTrip);

router.get('/getActiveTrips', auth, rider.getActiveTrips);

router.put('/rateUser', auth, rider.rateUser);

router.put('/finishTrip', auth, rider.finishTrip);

// router.post('/getTripDetail', rider.getTripDetail);

module.exports = router;