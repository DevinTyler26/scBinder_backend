const { Staff, validate } = require("../models/staff");
const { Location } = require("../models/location");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const staffs = await Staff.find()
    .select("-__v")
    .sort("name");
  res.send(staffs);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const location = await Location.findById(req.body.locationId);
  if (!location) return res.status(400).send("Invalid location.");

  const staff = new Staff({
    name: req.body.name,
    credentials: req.body.credentials || " ",
    gender: req.body.gender || " ",
    location: {
      _id: location._id,
      name: location.name
    },
    daysInOffice: req.body.daysInOffice || " ",
    languages: req.body.languages || " ",
    education: req.body.education || " ",
    bio: req.body.bio || " ",
    special: req.body.special || " ",
    profileUrl:
      req.body.profileUrl ||
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
    wellcheck: req.body.wellcheck || " ",
    publishDate: moment().toJSON()
  });
  await staff.save();

  res.send(staff);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const location = await Location.findById(req.body.locationId);
  if (!location) return res.status(400).send("Invalid location.");

  const staff = await Staff.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      credentials: req.body.credentials || " ",
      gender: req.body.gender || " ",
      location: {
        _id: location._id,
        name: location.name
      },
      daysInOffice: req.body.daysInOffice || " ",
      languages: req.body.languages || " ",
      education: req.body.education || " ",
      bio: req.body.bio || " ",
      special: req.body.special || " ",
      profileUrl:
        req.body.profileUrl ||
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      wellcheck: req.body.wellcheck || " "
    },
    { new: true }
  );

  if (!staff)
    return res.status(404).send("The staff with the given ID was not found.");

  res.send(staff);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const staff = await Staff.findByIdAndRemove(req.params.id);

  if (!staff)
    return res.status(404).send("The staff with the given ID was not found.");

  res.send(staff);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const staff = await Staff.findById(req.params.id).select("-__v");

  if (!staff)
    return res.status(404).send("The staff with the given ID was not found.");

  res.send(staff);
});

module.exports = router;
