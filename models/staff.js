const Joi = require("joi");
const mongoose = require("mongoose");
const { locationSchema } = require("./location");

const Staff = mongoose.model(
  "Staffs",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60
    },
    credentials: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      trim: true,
      minlength: 1
    },
    location: {
      type: locationSchema,
      required: true
    },
    daysInOffice: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 255
    },
    languages: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 255
    },
    education: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    special: {
      type: String,
      trim: true
    },
    profileUrl: {
      type: String,
      trim: true
    },
    wellcheck: {
      type: String,
      trim: true
    },
    publishDate: {
      type: Date,
      trim: true
    }
  })
);

function validateStaff(staff) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    credentials: Joi.string()
      .min(1)
      .required(),
    gender: Joi.string()
      .min(1)
      .required(),
    locationId: Joi.objectId().required(),
    daysInOffice: Joi.string()
      .min(2)
      .max(255)
      .required(),
    languages: Joi.string()
      .min(2)
      .max(255)
      .required(),
    education: Joi.string(),
    bio: Joi.string(),
    special: Joi.string(),
    profileUrl: Joi.string(),
    wellcheck: Joi.string()
  };

  return Joi.validate(staff, schema);
}

exports.Staff = Staff;
exports.validate = validateStaff;
