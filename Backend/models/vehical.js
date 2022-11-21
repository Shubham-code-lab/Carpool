const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    driverId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'Driver'
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true
    }
});


module.exports =mongoose.model('Vehical', userSchema);