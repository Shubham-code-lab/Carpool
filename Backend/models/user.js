const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
    joiningDate:{
        type: Date,
        default: Date.now
    },
    driverId:{
        type: Schema.Types.ObjectId,
        ref: 'driver'
    },
    riderId:{
        type: Schema.Types.ObjectId,
        ref: 'rider'
    }
});


module.exports =mongoose.model('User', userSchema);