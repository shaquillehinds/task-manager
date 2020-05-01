const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const usersRoute = require("./routers/usersRoute");
const tasksRoute = require("./routers/tasksRoute");
const cors = require("cors");

require("./db/mongoose");

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/users", usersRoute);
app.use("/tasks", tasksRoute);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
