const User = require("../models/user");
const Driver = require("../models/driver");
const Vehical = require("../models/vehical");
const AvailableTrip = require("../models/availableTrip");

exports.addVehicals = (req, res, next) => {
  console.log("addVehical");
  const userId = req.userId;
  const brand = req.body.brand;
  const model = req.body.model;
  const registrationNumber = req.body.registrationNumber;
  const seats = req.body.seats;

  let existingUser = null;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("A user does not exist");
        error.statusCode = 204;
        throw error;
      }

      existingUser = user;
      if (!user.driverId) {
        const driver = new Driver({
          userId: user._id, //update user_id in Driver model
          rating: 0,
          feedBack: [],
          totalTrips: 0,
          vehicals: [],
        });

        return driver.save(); //returning new driver
      } else {
        return Driver.findById(user.driverId); //returning existing driver
      }
    })
    .then((driver) => {
      console.log("driver created or exisitng driver recived");
      // set driverId into User model
      existingUser.driverId = driver._id; //upadting  driver_id in User model
      existingUser
        .save()
        .then((user) => {
          const vehical = new Vehical({
            //TODO:- registration is unique
            //create new vehical
            driverId: driver._id, //update driver_id in Vehical model
            brand,
            model,
            registrationNumber,
            seats,
          });
          vehical
            .save()
            .then((vehical) => {
              driver.vehicals.push(vehical._id); //update vehical_id in Driver model
              return driver.save();
            })
            .then((driver) => {
              res.status(201).json({ message: "Vehical added" }); //TODO :- return driver id and other thind
            })
            .catch((err) => {
              console.log(err);
              const error = new Error(
                "Cannot create vehical or update Driver model with vehical_id "
              );
              error.statusCode = 500;
              throw error;
            });
        })
        .catch((err) => {
          const error = new Error("Cannot update User Model with driver_id");
          error.statusCode = 500;
          throw error;
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getVehicals = (req, res, next) => {
  //statusCode  500,204 = vehical empty //302 = send vehical
  console.log("getvehicals");
  const userId = req.userId;
  User.findById(userId)
    .then((user) => {
      //user.driverId = null, vehical
      if (!user || !user.driverId) {
        //set vehical empty
        res.status(204).json({ vehicals: [] });
        throw new Error("No Vehicals");
      }
      return Driver.findById(user.driverId);
    })
    .then((driver) => {
      if (!driver) {
        //set vehical empty
        res.status(204).json({ vehicals: [] });
        throw new Error("No Vehicals");
      }
      return Vehical.find({ driverId: driver._id });
    })
    .then((vehicals) => {
      if (!vehicals || vehicals.length <= 0) {
        res.status(204).json({ vehicals: [] });
        throw new Error("No Vehicals");
      }
      res.status(302).json({ vehicals });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // next(err);
    });
};

exports.addTrip = (req, res, next) => {
  const userId = req.userId;
  const fromLocationName = req.body.fromLocationName;
  const toLocationName = req.body.toLocationName;
  const tripDateTime = new Date(req.body.tripDateTime);
  const tripEndDateTime = new Date(req.body.tripEndDateTime);
  const availableSeats = req.body.availableSeats;
  const pricePerSeat = req.body.pricePerSeat;
  const vehicalId = req.body.vehicalId;
  let firstName = "";
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("user does not exist in collection");
        error.statusCode = 403;
        throw error;
      }
      firstName = user.firstName;
      return Driver.findById(user.driverId);
    })
    .then((driver) => {
      if (!driver) {
        const error = new Error("user is not a driver");
        error.statusCode = 403;
        throw error;
      } else if (
        driver.vehicals.find(
          (vehicalId) => vehicalId.toString() === vehicalId.toString()
        )
      ) {
        return Vehical.findById(vehicalId);
      } else {
        const error = new Error("Vehical doesn't belong to driver");
        error.statusCode = 403;
        throw error;
      }
    })
    .then((vehical) => {
      if (!vehical) {
        const error = new Error(
          "vehical not present in the Vehical collection"
        );
        error.statusCode = 403;
        throw error;
      }
      return AvailableTrip.find({ driverId: vehical.driverId })
        .then((existingAvailableTrips) => {
          if (!existingAvailableTrips) {
            const error = new Error(
              "No scheduled trip data available collection"
            );
            error.statusCode = 403;
            throw error;
          }
          let validDate = true;
          let temp = [...existingAvailableTrips];    //mongoose return live document //so to prevent it :- it add new shedule and then loop that new schedule
          temp.forEach((existingAvailableTrip) => {
            let existingTripStartDateMilliSecond = new Date(
              existingAvailableTrip.tripDateTime
            ).getTime();
            let existingTripEndDateMilliSecond = new Date(
              existingAvailableTrip.tripEndDateTime
            ).getTime();
            const oneDay = 1000 * 60 * 60 * 24;
            if (
              !(
                (+tripDateTime.getTime() <
                  +existingTripStartDateMilliSecond && +tripEndDateTime.getTime() < +existingTripStartDateMilliSecond) ||
                  (+tripDateTime.getTime() >
                  +existingTripEndDateMilliSecond && +tripEndDateTime.getTime() > +existingTripEndDateMilliSecond)
              )
            ) {
              validDate = false;
            }
          });
          if (validDate) {
            const availableTrip = new AvailableTrip({
              driverId: vehical.driverId,
              vehicalId,
              firstName,
              fromLocationName,
              toLocationName,
              tripDateTime,
              tripEndDateTime,
              availableSeats,
              pricePerSeat,
            });
            return availableTrip.save();
          } else {
            const error = new Error("PLease pick another date you have already have a trip schedule on corresponding date");
            error.statusCode = 403;
            throw error;
          }
        })
        .catch((err) => {
          console.log(err.statusCode);
          if (!err.statusCode) {
            const err = new Error("ExistingAvailableTrips server error");
            err.statusCode = 500;
            throw err;
          }else
          throw err;
        });
    })
    .then((newTripData) => {
      res.status(201).json({ message: "trip added successfully" });
    })
    .catch((err) => {
      console.log(err.statusCode);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
