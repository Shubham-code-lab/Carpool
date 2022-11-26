const User = require("../models/user");
const Driver = require("../models/driver");
const Vehical = require("../models/vehical");
const AvailableTrip = require("../models/availableTrip");
const availableTrip = require("../models/availableTrip");

exports.getTrips = (req, res, next) => {
  console.log("rider getTrips");
  // .populate('driverId', '_id userId rating')
  AvailableTrip.find()
  .populate('driverId', '_id userId rating')
  .populate('vehicalId','_id brand model seats')
    .then((availableTrips) => {
      if (!availableTrips) {
        const error = new Error("No trips available");
        error.statusCode = 204;
        throw error;
      }
      console.log(availableTrips);
      res.status(200).json({ availableTrips });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
