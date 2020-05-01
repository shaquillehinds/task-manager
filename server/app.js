const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const usersRoute = require("./routers/usersRoute");
const tasksRoute = require("./routers/tasksRoute");
const cors = require("cors");

require("./db/mongoose");

app.use(cors());
app.use(express.json());
app.use("/users", usersRoute);
app.use("/tasks", tasksRoute);

module.exports = app;
