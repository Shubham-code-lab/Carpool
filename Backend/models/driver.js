const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating:{
        type: Number,
        default: 0
    },
    feedBack:{
        type: String
    },
    totalTrips:{
        type: Number
    },
    vehical:[
        {
            type: Schema.Types.ObjectId
        }
    ],
});


module.exports =mongoose.model('Driver', driverSchema);