// import bookingModel from './bookingModel';
const mongoose = require('mongoose');
// const Show = require('./models/movieModel');

const showSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    date : {
        type: Date,
        required: true
    },
    time : {
        type: String,
        required: true
    },
    movie : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies',
        required: true
    },
    ticketPrice : {
        type: Number,
        required: true
    },
    totalSeats : {
        type: Number,
        required: true
    },
    bookedSeats : {
        type: Array,
        default: []
    },
    theatre : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theatres',
        required: true
    },
     isRunning: {
      type: Boolean,
      default: false
    }
} , { timestamps: true });

const Show = mongoose.model('shows', showSchema);

module.exports = Show;