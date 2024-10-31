const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      require: true,
      trim: true,
    },
    middlename: {
      type: String,
      trim: true,
    },
    lastname: {
      type: String,
      require: true,
      trim: true,
    },
    gender: {
      type: String,
      require: true,
      trim: true,
      enum: ["male", "female", "others"],
    },
    dob: {
      type: String,
      require: true,
    },
    occupation: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      require: true,
      unique: true,
    },
    maritalstatuse: {
      type: String,
      trim: true,
      require: true,
    },
    staffId:{
      type: String,
      trim: true,
      unique: true,
    },
    contact: {
      type: String,
    },
    profile: {
      picture: {
         type: String,
         default:
           "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
           trim: true,
       },
       publicId:{
         type: String
       }
     },
    password: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["none","addmitted", "diacharged",],
      default : 'none'
    },
    bill: {
      type: Number,
      required: true,
      min: 0
    },
    medicalHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "MedicalHistory"
      }
    ]
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Patient", PatientSchema);
