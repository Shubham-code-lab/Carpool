const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const riderSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating:{
        type: Number,
        default: 1
    },
    feedBack:[
        {
            type: String
        }
    ],
    totalTrips:{
        type: Number,
        default: 0
    },
});


module.exports =mongoose.model('Rider', riderSchema);