const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name: {
        type:String,
        trim: true,
        require: true,
        unique: true
    },
    bio:{
        type: String,
        trim: true
    },
    contact:{
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        trim:true,
        unique: true,
        require: true
    },
    username: {
        type: String,
        unique: true,
        trim: true
    },
    wallet:{
        number:{
            type:String,
            trim: true,
            require: true
        },
        name: {
            type:String,
            trim: true,
            require: true
        }
    },

    ambulancecontact :{
        type: String,
        require: true,
        trim: true
    },
    subscriptionstatus :{
        type: String,
        enum: ['active', 'expired'],
        default: 'expired'
    },
    address:{
        type: String,
        trim: true,
        require: true
    },
    logo: {
        type: String,
        trim: true,
        require: true
    },
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Reviews"
        }
    ]

});

const Hospitals = mongoose.model('Hospitals', HospitalSchema);

module.exports = Hospitals;