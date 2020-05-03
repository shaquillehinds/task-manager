const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const usersRoute = require("./routers/usersRoute");
const tasksRoute = require("./routers/tasksRoute");
const cors = require("cors");
const path = require("path");

require("./db/mongoose");

app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());
app.use(express.json());
app.use("/users", usersRoute);
app.use("/tasks", tasksRoute);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
