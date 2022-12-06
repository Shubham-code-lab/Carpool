const User = require("../models/user");
const Driver = require("../models/driver");
const Vehical = require("../models/vehical");
const AvailableTrip = require("../models/availableTrip");
const Rider = require("../models/rider");
const ActiveTrip = require("../models/activeTrip");
const TripHistory = require("../models/tripHistory");

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
      return currentUser
        .save()
        .then((user) => {
          let riderExist = false;
          tripDetailVar.bookedSeats = tripDetailVar.bookedSeats.map(
            (bookedSeat) => {
              // bookedSeat.totalSeats = +bookedSeat.totalSeats + +passengers;
              if (bookedSeat.riderId.toString() === user.riderId.toString()) {
                riderExist = true;
                return {
                  riderId: user.riderId,
                  userId: user._id,
                  totalSeats: +bookedSeat.totalSeats + +passengers,
                };
              } else return bookedSeat;
            }
          );
          if (!riderExist) {
            tripDetailVar.bookedSeats.push({
              riderId: rider._id,
              userId: rider.userId,
              totalSeats: +passengers,
            });
          }
          tripDetailVar.availableSeats -= passengers;
          return tripDetailVar.save();
        })
        .catch((err) => {
          const error = new Error("can't save rider id to user");
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
        activeBookesSeats = tripDetail.bookedSeats.map((bookedSeat) => {
          //setting active:false filed
          return {
            ...bookedSeat,
            active: false,
          };
        });
        const activeTrip = new ActiveTrip({
          vehicalId: tripDetail.vehicalId,
          driverId: tripDetail.driverId,
          fromLocationName: tripDetail.fromLocationName,
          toLocationName: tripDetail.toLocationName,
          tripDateTime: tripDetail.tripDateTime,
          tripEndDateTime: tripDetail.tripEndDateTime,
          pricePerSeat: tripDetail.pricePerSeat,
          active: false,
          bookedSeats: activeBookesSeats,
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

exports.getScheduleTrips = (req, res, next) => {
  console.log("rider getActiveTrips");
  const userId = req.userId;
  // console.log(userId);
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const err = new Error("User Doesn't exist");
        err.statusCode = 404;
        throw err;
      }
      // console.log(user.riderId);
      return ActiveTrip.find({ "bookedSeats.riderId": user.riderId })
        .populate("driverId")
        .populate("vehicalId")
        .populate("bookedSeats.riderId", "_id rating")
        .populate("bookedSeats.userId", "_id firstName lastName email");
    })
    .then((activeTrips) => {
      if (!activeTrips) {
        const err = new Error("No ActiveTrip");
        err.statusCode = 404;
        throw err;
      }
      // console.log(activeTrips);
      const filteredActiveTrips = activeTrips.filter((activeTrip) => {
        for (
          let bookedSeatIndex = 0;
          bookedSeatIndex < activeTrip.bookedSeats.length;
          bookedSeatIndex++
        ) {
          if (
            activeTrip.bookedSeats[bookedSeatIndex].userId._id.toString() ===
            userId.toString()
          ) {
            return !activeTrip.bookedSeats[bookedSeatIndex].active;
          }
        }
      });
      res.status(200).json({ activeTrips: filteredActiveTrips });
    })
    .catch((err) => {
      console.log(err.statusCode);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.startTrip = (req, res, next) => {
  console.log("rider startTrip");
  const tripId = req.body.tripId;
  const userId = req.userId;
  const activeToken = req.body.activeToken;
  ActiveTrip.findById(tripId)
    .then((activeTrip) => {
      if (!activeTrip) {
        const err = new Error("Trip Doesn't exist");
        err.statusCode = 404;
        throw err;
      }

      const userBookedIndex = activeTrip.bookedSeats.findIndex(
        (currentBookedSeat) => {
          return currentBookedSeat.userId.toString() === userId.toString();
        }
      );
      if (
        activeTrip.bookedSeats[userBookedIndex].activeToken.toString() ===
        activeToken.toString()
      ) {
        activeTrip.bookedSeats[userBookedIndex].active = true;
        activeTrip.active = true;
      } else {
        const err = new Error("Invalid Token");
        err.statusCode = 404;
        throw err;
      }
      return activeTrip.save();
    })
    .then((activeTrip) => {
      activeTrip.save();
      res.status(200).json({ msg: "succesfully started" });
    })
    .catch((err) => {
      console.log(err.statusCode);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getActiveTrips = (req, res, next) => {
  const userId = req.userId;
  let varActiveTrips = null;
  let idType = "None";

  ActiveTrip.find({ active: true })
    .then((activeTrips) => {
      if (!activeTrips || activeTrips.length < 1) {
        const err = new Error("No active trip");
        err.statusCode = 404;
        throw err;
        
      }
      varActiveTrips = activeTrips;
      return User.findById(userId);
    })
    .then((user) => {
      if (!user) {
        const err = new Error("login User Doesn't exist");
        err.statusCode = 404;
        throw err;
      }
      let currentUserDriverId = user.driverId;
      let currentUserRiderId = user.riderId;
      const UserActiveTripIndex = varActiveTrips.findIndex(
        (currentActiveTrip) => {
          if (
            currentUserDriverId &&
            currentActiveTrip.driverId.toString() ===
              currentUserDriverId.toString()
          ) {
            idType = "Driver";
            return true;
          } else if (
            currentUserRiderId &&
            currentActiveTrip.bookedSeats.find((bookedSeat) => {
              return (
                bookedSeat.riderId.toString() === currentUserRiderId.toString()
              );
            })
          ) {
            idType = "Rider";
            return true;
          }
        }
      );

      if (UserActiveTripIndex >= 0) {
        return ActiveTrip.findById(varActiveTrips[UserActiveTripIndex]._id)
          .select("driverId bookedSeats")
          .populate("driverId")
          .populate("bookedSeats.riderId")
          .populate(
            "bookedSeats.userId",
            "_id firstName lastName email gender dateOfBirth"
          );
      } else {
        const err = new Error("No Active Trip");
        err.statusCode = 404;
        throw err;
      }
    })
    .then(async (userActiveTrip) => {
      if (userActiveTrip.driverId.feedBack.length > 0)
        //rating
        userActiveTrip.driverId.rating /=
          userActiveTrip.driverId.feedBack.length + 1;

      userActiveTrip.bookedSeats = userActiveTrip.bookedSeats.map(
        (bookedSeat) => {
          if (bookedSeat.riderId.feedBack.length > 0)
            bookedSeat.riderId.rating /= bookedSeat.riderId.feedBack.length + 1;
          return bookedSeat;
        }
      );

      userActiveTrip.bookedSeats = userActiveTrip.bookedSeats.filter(bookedSeat=>{
        return bookedSeat.active;
      })

      return await User.findById(userActiveTrip.driverId.userId)
        .select("_id firstName lastName email gender dateOfBirth")
        .then((user) => {
          if (!user) {
            if (!user) {
              const err = new Error("Driver with UseID Doesn't exist");
              err.statusCode = 404;
              throw err;
            }
          }
          userActiveTrip.driverId.userId = user;

          return userActiveTrip;
        });
    })
    .then((userActiveTrip) => {
      res.status(200).json({ userIs: idType, activeTrip: userActiveTrip });
    })
    .catch((err) => {
      console.log(err.statusCode);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.rateUser = (req, res, next) => {
  console.log("rider rateUser");

  const rating = req.body.rating;
  const id = req.body.id;
  const userIs = req.body.userIs;
  const tripId = req.body.tripId;
  const feedBack = req.body.feedBack;
  const userId = req.userId;

  ActiveTrip.findById(tripId)
    .then((activeTrip) => {
      if (!activeTrip) {
        const err = new Error("No active trip");
        err.statusCode = 404;
        throw err;
      }
      if (userIs == "driver") {
        return Driver.findById(id);
      } else if (userIs == "rider") {
        return Rider.findById(id);
      }
    })
    .then((driverORuser) => {
      if (!driverORuser) {
        const err = new Error("can't find driver/rider");
        err.statusCode = 404;
        throw err;
      }
      if (driverORuser.userId.toString() === userId.toString()) {
        const err = new Error("can't rate yourself");
        err.statusCode = 404;
        throw err;
      }
      driverORuser.rating += rating; //rating
      driverORuser.feedBack.push(feedBack);
      driverORuser.save();
    })
    .then((driverORuser) => {
      res.status(200).json({ msg: "submitted succesfully" });
    })
    .catch((err) => {
      console.log(err.statusCode);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.finishTrip = (req, res, next) => {
  const userId = req.userId;
  const tripId = req.body.tripId;
  const userIs = req.body.userIs;
  let id = null;
  let varActiveTrip = null;
  console.log("0", id);

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const err = new Error("can't determine is user driver or rider");
        err.statusCode = 404;
        throw err;
      }
      if (userIs == "Driver") {
        id = user.driverId;
      } else if (userIs == "Rider") {
        id = user.riderId;
      } else {
        const err = new Error("can't determine is user driver or rider");
        err.statusCode = 404;
        throw err;
      }
    })
    .then((userExist) => {
      return ActiveTrip.findById(tripId).then((activeTrip) => {
        if (!activeTrip) {
          const err = new Error("activeTrip with given id doesn't exist");
          err.statusCode = 404;
          throw err;
        }
        varActiveTrip = activeTrip;
        if (userIs == "Driver") {
          if (activeTrip.bookedSeats.length <= 0) {
            return TripHistory.find({ driverId: id });
          } else {
            const err = new Error("all passenger need to finis trip");
            err.statusCode = 404;
            throw err;
          }
        } else if (userIs == "Rider") {
          console.log("1");
          return TripHistory.findOne({ driverId: varActiveTrip.driverId }).then(                //cann't find???  find by driver
            (tripHistory) => {
              console.log("2", tripHistory);
              if (!tripHistory) {
                console.log("3");
                const newTripHistory = new TripHistory({
                  vehicalId: activeTrip.vehicalId,
                  driverId: activeTrip.driverId,
                  fromLocationName: activeTrip.fromLocationName,
                  toLocationName: activeTrip.toLocationName,
                  tripDateTime: activeTrip.tripDateTime,
                  tripEndDateTime: activeTrip.tripEndDateTime,
                  pricePerSeat: activeTrip.pricePerSeat,
                  bookedSeats: [],
                });
                console.log("4", newTripHistory);
                return newTripHistory.save();
              }
              return tripHistory;
            }
          );
        }
      });
    })
    .then((tripHistory) => {
      if (!tripHistory && !tripHistory[0]) {
        const err = new Error("tripHistory doesn't exist");
        err.statusCode = 404;
        throw err;
      }
      if (userIs == "Driver") {
        return ActiveTrip.deleteOne({ _id: varActiveTrip._id });
      } else if (userIs == "Rider") {
        // remove passenger from activeTrip and add to tripHistory
        console.log("6", varActiveTrip);
        const newHistoryTripbookedSeats = varActiveTrip.bookedSeats.filter(
          (bookedSeat) => {
            return bookedSeat.riderId.toString() === id.toString();
          }
        );
        console.log("7");
        varActiveTrip.bookedSeats = varActiveTrip.bookedSeats.filter(
          (bookedSeat) => {
            return bookedSeat.riderId.toString() !== id.toString();
          }
        );
        console.log("8",varActiveTrip);
        return varActiveTrip.save().then((activeTrip) => {
          if (!activeTrip) {
            const err = new Error("can't able to update activeTrip ");
            err.statusCode = 404;
            throw err;
          }
          console.log("9",activeTrip);
          console.log("10",tripHistory);
          tripHistory.bookedSeats.push(newHistoryTripbookedSeats[0]);
          console.log("11",tripHistory);
          return tripHistory.save();
        });
      }
    })
    .then((result) => {
      if (!result) {
        const err = new Error("can't able to delete or update activeTrip ");
        err.statusCode = 404;
        throw err;
      }
      console.log("12");
      res.status(200).json({ msg: "Successfully trip finished" });
    })
    .catch((err) => {
      console.log(err.statusCode);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
