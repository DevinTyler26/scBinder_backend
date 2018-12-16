const express = require("express");
const locations = require("../routes/locations");
const staff = require("../routes/staff");
const providers = require("../routes/providers");

const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/locations", locations);
  app.use("/api/staff", staff);
  app.use("/api/providers", providers);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
