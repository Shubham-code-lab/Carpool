const User = require("../models/user");
const Driver = require("../models/driver");
const Vehical = require("../models/vehical");
const AvailableTrip = require("../models/availableTrip");
const availableTrip = require("../models/availableTrip");

exports.getTrips = (req, res, next) => {
  let searchData = {};
  // const search= true;
  //         date: this.date || new Date(),
  //         passengers: this.passengers,
  //         selectedFromLocation: this.selectedFromLocation,
  //         selectedToLocation: this.selectedToLocation,
  let search = req.body.search;
  let selectedFromLocation = req.body.selectedFromLocation;
  let selectedtoLocationName =req.body.selectedtoLocationName;
  let totalPassengers = +req.body.passengers;
  let date = req.body.date;
  if (search) {
    searchData = {
      fromLocationName : selectedFromLocation,
      toLocationName: selectedtoLocationName,
    };
  }
  console.log("rider getTrips");
  // .populate('driverId', '_id userId rating')
  AvailableTrip.find(searchData)
    .populate("driverId", "_id userId rating")
    .populate("vehicalId", "_id brand model seats")
    .then((availableTrips) => {
      if (!availableTrips) {
        const error = new Error("No trips available");
        error.statusCode = 204;
        throw error;
      }
      console.log(availableTrips);
      if(search){
        availableTrips = availableTrips.filter(availableTrip=>{
          return ((+availableTrip.availableSeats) ==> (+totalPassengers)) && ((+(new Date(date).getTime())) <== (+(new Date(availableTrip.tripDateTime).getTime())))
        })
      }
      res.status(200).json({ availableTrips });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
