const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router
  .route("/")
  .get(auth, async (req, res) => {
    try {
      // const tasks = await Task.find({ owner: req.user._id });
      await req.user.populate("tasks").execPopulate();
      res.send(req.user.tasks);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .post(auth, async (req, res) => {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    try {
      // task = await Task.create(req.body);
      await task.save();
      res.status(201).send(task);
    } catch (e) {
      res.status(400).send(e);
    }
  });

router
  .route("/:id")
  .get(auth, async (req, res) => {
    const _id = req.params.id;
    try {
      const task = await Task.findOne({ _id, owner: req.user._id });
      if (!task) {
        return res.status(404).send("Task not found");
      }
      res.send(task);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .patch(auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["completed", "description"];
    const valid = updates.every((update) => allowedUpdates.includes(update));
    if (!valid) {
      return res.status(400).send("Invalid update request");
    }
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });

      if (!task) {
        return res.status(404).send("Task Not Found");
      }
      updates.forEach((update) => (task[update] = req.body[update]));
      await task.save();
      res.status(202).send(task);
    } catch (e) {
      res.status(400).send(e);
    }
  })
  .delete(auth, async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id,
      });
      if (!task) {
        return res.status(404).send("No Task Found");
      }
      res.send(task);
    } catch (e) {
      res.status(500).send(e);
    }
  });

module.exports = router;
