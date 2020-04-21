const express = require("express");
const mongoose = require("mongoose");
const User = require("./db/models/User");
const Task = require("./db/models/Task");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Unable to connect"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/users", (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
  });
  user
    .save()
    .then((userRes) => res.send(userRes))
    .catch((error) => res.send(error));
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
