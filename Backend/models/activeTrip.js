const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activeTripSchema = new Schema({
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
  tripEndDateTime: {
    type: Date,
    required: true,
  },
  pricePerSeat: {
    type: Number,
    required: true,
  },


  active:{
    type:Boolean,
    required:true,
  },
  

  bookedSeats:[
    {
      riderId:{
        type: Schema.Types.ObjectId,
        ref: "Rider",
      },
      totalSeats:{
        type: Number,
        required: true,
      },
      userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      active:{
        type:Boolean,
        required:true,
      },
      activeToken:{
        type:String,
        required:false,
      }
    }
  ]
});

module.exports = mongoose.model("ActiveTrip", activeTripSchema);
