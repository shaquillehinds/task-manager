const router = require("express").Router();
const User = require("../models/User");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).send(user);
    } catch (e) {
      res.status(400).send(e);
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send("No User Was Found");
      }
      res.send(user);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .patch(async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const valid = updates.every((update) => allowedUpdates.includes(update));
    if (!valid) {
      return res.status(400).send("Invalid update request");
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!user) {
        return res.status(404).send("User Not Found");
      }

      res.status(202).send(user);
    } catch (e) {
      res.status(400).send(e);
    }
  })
  .delete(async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send("No user was found");
      }
      res.send(user);
    } catch (e) {
      res.status(500).send(e);
    }
  });

module.exports = router;
