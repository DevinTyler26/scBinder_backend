const { Provider, validate } = require("../models/provider");
const { Location } = require("../models/location");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const providers = await Provider.find()
    .select("-__v")
    .sort("name");
  res.send(providers);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const location = await Location.findById(req.body.locationId);
  if (!location) return res.status(400).send("Invalid location.");

  const provider = new Provider({
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
  await provider.save();

  res.send(provider);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const location = await Location.findById(req.body.locationId);
  if (!location) return res.status(400).send("Invalid location.");

  const provider = await Provider.findByIdAndUpdate(
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

  if (!provider)
    return res
      .status(404)
      .send("The provider with the given ID was not found.");

  res.send(provider);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const provider = await Provider.findByIdAndRemove(req.params.id);

  if (!provider)
    return res
      .status(404)
      .send("The provider with the given ID was not found.");

  res.send(provider);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const provider = await Provider.findById(req.params.id).select("-__v");

  if (!provider)
    return res
      .status(404)
      .send("The provider with the given ID was not found.");

  res.send(provider);
});

module.exports = router;
