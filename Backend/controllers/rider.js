const User = require("../models/user");
const Driver = require("../models/driver");
const Vehical = require("../models/vehical");
const AvailableTrip = require("../models/availableTrip");
const Rider = require("../models/rider");
const ActiveTrip = require('../models/activeTrip');

exports.bookTrip = (req, res, next) => {
  console.log("rider bookTrip");
  const passengers = req.body.passengers;
  const tripId = req.body.tripId;
  const userId = req.userId;
  let tripDetailVar = null;
  let currentUser = null;

  AvailableTrip.findById(tripId)
    .then((tripDetail) => {
      if (!tripDetail) {
        const error = new Error("No trips available");
        error.statusCode = 404;
        throw error;
      }
      tripDetailVar = tripDetail;
      return Driver.findById(tripDetail.driverId);
    })
    .then((driver) => {
      if (!driver) {
        //driver not present
        const error = new Error("Driver Not found");
        error.statusCode = 404;
        throw error;
      }
      if (driver.userId.toString() === userId.toString()) {
        //same user and driver
        const error = new Error("Can't book your own trip");
        error.statusCode = 404;
        throw error;
      }
      return User.findById(userId);
    })
    .then((user) => {
      if (!user) {
        //user not present
        const error = new Error("user Not Found");
        error.statusCode = 404;
        throw error;
      }
      currentUser = user;
      if (!user.riderId) {
        const rider = new Rider({
          userId,
        });
        return rider.save();
      }
      return Rider.findById(user.riderId);
    })
    .then((rider) => {
      if (!rider) {
        //save failer or rider retrive fail
        const error = new Error(
          "failed to create rider document or to retrive"
        );
        error.statusCode = 404;
        throw error;
      }
      currentUser.riderId = rider._id;
      return currentUser.save()
      .then(user=>{
        let riderExist = false;
        tripDetailVar.bookedSeats = tripDetailVar.bookedSeats.map(bookedSeat=>{
            // bookedSeat.totalSeats = +bookedSeat.totalSeats + +passengers;
            if(bookedSeat.riderId.toString() === user.riderId.toString()){
              riderExist = true;
              return {
                riderId: user.riderId,
                totalSeats: +bookedSeat.totalSeats + +passengers,
              }
            }
            else return bookedSeat;
        })
        if(!riderExist){
          tripDetailVar.bookedSeats.push({
            riderId: rider._id,
            totalSeats: +passengers,
          });
        }
        tripDetailVar.availableSeats-=passengers;
        return tripDetailVar.save();
      })
      .catch(err=>{
        const error = new Error(
          "can't save rider id to user"
        );
        error.statusCode = 404;
        throw error;
      });
    })
    .then((tripDetail) => {
      if (!tripDetail) {
        //trip update fail
        const error = new Error("Not able to update availableTrips");
        error.statusCode = 404;
        throw error;
      }
      if (+tripDetail.availableSeats <= 0) {
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
        return activeTrip.save().then((activeTrip) => {
          if (!activeTrip) {
            //not saved
            const error = new Error("not able to create activeTrip");
            error.statusCode = 404;
            throw error;
          }
          return AvailableTrip.deleteOne({ _id: tripDetail._id }).then(
            (availableTrip) => {
              if (!availableTrip) {
                //not deleted
                const error = new Error(
                  "not able to delete trip from availble trip"
                );
                error.statusCode = 404;
                throw error;
              }
              return "available trip to activeTrip";
            }
          );
        });
      }
      return "available trip booked";
    })
    .then((result) => {
      res.status(201).json({ msg: "Trip Booked" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
