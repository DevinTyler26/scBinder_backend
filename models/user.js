const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      username: this.username,
      isAdmin: this.isAdmin
    },
    process.env.jwtPrivateKey
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    username: Joi.string()
      .min(2)
      .max(255)
      .required(),
    password: Joi.string()
      .min(4)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
