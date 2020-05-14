const router = require("express").Router();
const Task = require("../models/TaskModel");
const auth = require("../middleware/auth");
const sharp = require("sharp");

const multer = require("multer");
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpe?g)$/)) {
      cb(new Error("Please upload a file that is png, jpg or jpeg"));
    }
    cb(undefined, true);
  },
});

router
  .route("/")
  .get(auth, async (req, res) => {
    let { limit = 10, skip = 0, completed, sort = {} } = req.query;
    limit = parseInt(limit);
    skip = parseInt(skip);
    const objectify = (input) => {
      const key = input[0];
      const value = input[1] === "asc" ? 1 : -1;
      sort = {};
      sort[key] = value;
    };
    typeof sort === "string" ? objectify(sort.split(":")) : (sort.completed = 1);
    const match = {};
    if (completed) {
      match.completed = completed === "true";
    }
    try {
      await req.user
        .populate({
          path: "tasks",
          match,
          options: { limit, skip, sort },
        })
        .execPopulate();
      const count = await Task.countDocuments({ owner: req.user._id });
      const completed = await Task.countDocuments({ owner: req.user._id, completed: true });
      const notCompleted = count - completed;
      const tasks = req.user.tasks;
      res.send({ tasks, count, completed, notCompleted });
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .post(auth, upload.single("image"), async (req, res) => {
    let task;
    if (req.file) {
      const buffer = await sharp(req.file.buffer).resize(100, 100).png().toBuffer();
      task = new Task({
        ...req.body,
        image: buffer,
        owner: req.user._id,
      });
    } else {
      task = new Task({
        ...req.body,
        owner: req.user._id,
      });
    }
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
    const updates = Object.keys(req.body.update);
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
      updates.forEach((update) => (task[update] = req.body.update[update]));
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
