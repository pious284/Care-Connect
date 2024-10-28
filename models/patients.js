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
    position: {
      type: String,
      enum: ["admin", "specialist", "midwife", "doctor", "nurse"],
    },
    contact: {
      type: String,
    },
    profile: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["addmitted", "diacharged",]
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
