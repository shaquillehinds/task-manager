const router = require("express").Router();
const Task = require("../models/Task");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const tasks = await Task.find();
      res.send(tasks);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    try {
      task = await Task.create(req.body);
      res.status(201).send(task);
    } catch (e) {
      res.status(400).send(e);
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).send("Task not found");
      }
      res.send(task);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .patch(async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["completed", "description"];
    const valid = updates.every((update) => allowedUpdates.includes(update));
    if (!valid) {
      return res.status(400).send("Invalid update request");
    }
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!task) {
        return res.status(404).send("Task Not Found");
      }

      res.status(202).send(task);
    } catch (e) {
      res.status(400).send(e);
    }
  })
  .delete(async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).send("No Task Found");
      }
      res.send(task);
    } catch (e) {
      res.status(500).send(e);
    }
  });

module.exports = router;
