const User = require("../models/user");
const Driver = require("../models/driver");
const Vehical = require("../models/vehical");
const vehical = require("../models/vehical");

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
      //vehicals
      // let simplifyVehicals = [
      //   ...vehicals.map(vehical=>{
      //     return {
      //       ...vehical,
      //       _id: vehical._id.toString(),
      //       driverId: vehical.vehical.toString()
      //     }
      //   })
      // ]
      // console.log(simplifyVehicals);
      res.status(302).json({vehicals});
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // next(err);
    });
};