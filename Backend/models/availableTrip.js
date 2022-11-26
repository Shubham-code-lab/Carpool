const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const availableTripSchema = new Schema({
  vehicalId: {
    type: Schema.Types.ObjectId,
    ref: "Vehical",
    required: true,
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  fromLocationName: {
    type: String,
    required: true,
  },
  toLocationName: {
    type: String,
    required: true,
  },
  tripDateTime: {
    type: Date,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  pricePerSeat: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("availableTrip", availableTripSchema);
