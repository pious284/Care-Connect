const mongoose = require('mongoose')


const AppointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email:{
        type: String,
        require: true,
        trim: true
    },
    date:{
        type: Date,
        require: true,
        trim: true
    },
    field:{
        type: String,
        require: true,
        trim: true
    },
    message:{
        type: String,
        require: true,
        trim: true
    },
    staff:{
        type: mongoose.Schema.ObjectId,
        ref: 'staffs'
    },
    facility:{
        type: mongoose.Schema.ObjectId,
        ref: 'hospitals'
    }
});

const Appointments = mongoose.model('Appointments', AppointmentSchema);

module.exports = Appointments;