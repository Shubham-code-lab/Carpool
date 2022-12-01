const User = require("../models/user");
const Driver = require("../models/driver");
const Vehical = require("../models/vehical");
const AvailableTrip = require("../models/availableTrip");
const ActiveTrip = require("../models/activeTrip");

exports.getTrips = (req, res, next) => {
  console.log("guest getTrips");
  let searchData = {};
  let search = req.body.search;
  let selectedFromLocation = req.body.selectedFromLocation;
  let selectedtoLocationName = req.body.selectedToLocation;
  let totalPassengers = +req.body.passengers;
  let date = req.body.date;
  let filteredAvailableTrips = [];
  if (search) {
    searchData = {
      fromLocationName: selectedFromLocation,
      toLocationName: selectedtoLocationName,
    };
  }
  // .populate('driverId', '_id userId rating')
  AvailableTrip.find(searchData)
    .populate("driverId", "_id userId rating")
    .populate("vehicalId", "_id brand model seats")
    .then((availableTrips) => {
      if (!availableTrips) {
        const error = new Error("No trips available");
        error.statusCode = 404;
        throw error;
      }
      filteredAvailableTrips = [...availableTrips];
      //check trip before 1hr of start time
      return filteredAvailableTrips.filter(async (tripDetail) => {  //TODO:- no one request data not able to update
        if (
          +new Date(tripDetail.tripDateTime).getTime() <
          +new Date().getTime() + 1000 * 60 * 60
        ) {
          const activeTrip = new ActiveTrip({
            vehicalId: tripDetail.vehicalId,
            driverId: tripDetail.driverId,
            fromLocationName: tripDetail.fromLocationName,
            toLocationName: tripDetail.toLocationName,
            tripDateTime: tripDetail.tripDateTime,
            tripEndDateTime: tripDetail.tripEndDateTime,
            pricePerSeat: tripDetail.pricePerSeat,
            bookedSeats: tripDetail.bookedSeats,
          });
          return await activeTrip.save().then(async (activeTrip) => {
            if (!activeTrip) {
              //not saved
              const error = new Error("not able to create activeTrip");
              error.statusCode = 404;
              throw error;
            }
            return await AvailableTrip.deleteOne({ _id: tripDetail._id }).then(
              (availableTrip) => {
                if (!availableTrip) {
                  //not deleted
                  const error = new Error(
                    "not able to delete trip from availble trip"
                  );
                  error.statusCode = 404;
                  throw error;
                }
                console.log(false);
                return false;
              }
            );
          });
        } else {
          console.log(true);
          return true;
        }
      });
    })
    .then((filteredAvailableTrips) => {
      if (search) {
        filteredAvailableTrips = filteredAvailableTrips.filter(
          (availableTrip) => {
            const searchDateMilliSecond = +new Date(date).getTime();
            const availableTripDateMilliSecond = +new Date(
              availableTrip.tripDateTime
            ).getTime();
            const searchDate = new Date(date);
            const searchDateEndMilliSecond = +new Date(
              `${searchDate.getFullYear()}, ${+searchDate.getMonth() + 1}, ${
                searchDate.getDate() + 1
              }`
            ).getTime();
            return (
              +availableTrip.availableSeats >= +totalPassengers &&
              searchDateMilliSecond <= availableTripDateMilliSecond &&
              availableTripDateMilliSecond <= searchDateEndMilliSecond
            );
          }
        );
      }
      filteredAvailableTrips = filteredAvailableTrips.filter(
        (availableTrip) => {
          return +availableTrip.availableSeats > 0;
        }
      );
      res.status(200).json({ availableTrips: filteredAvailableTrips });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getTripDetail = (req, res, next) => {
  console.log("guest getTripDetail");
  const tripId = req.body.tripId;
  let responseTripDetail = null;

  AvailableTrip.findById(tripId)
    .populate("driverId", "_id userId rating totalTrips feedBack")
    .populate("vehicalId", "_id brand model seats")
    .then((tripDetail) => {
      if (!tripDetail) {
        const error = new Error("No trip available with requested _id");
        error.statusCode = 404;
        throw error;
      }
      if (!(+tripDetail.availableSeats > 0)) {
        console.log(+tripDetail.availableSeats);
        const error = new Error("All seats are full");
        error.statusCode = 404;
        throw error;
      }
      responseTripDetail = { ...tripDetail._doc };
      return User.findById(tripDetail.driverId.userId);
    })
    .then((user) => {
      if (!user) {
        const error = new Error("User cann't be found");
        error.statusCode = 404;
        throw error;
      }
      // console.log(user);
      responseTripDetail = {
        ...responseTripDetail,
        firstName: user.firstName,
        joiningDate: user.joiningDate,
        gender: user.gender,
        lastName: user.lastName,
      };
      firstName = user.firstName;
      joiningDate = user.joiningDate;
      gender = user.gender;
      lastName = user.lastName;
      // console.log(responseTripDetail);
      res.status(200).json({ tripDetail: responseTripDetail });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
