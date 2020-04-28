const express = require("express");
const app = express();
const usersRoute = require("./routers/usersRoute");
const tasksRoute = require("./routers/tasksRoute");
require("./db/mongoose");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", usersRoute);
app.use("/tasks", tasksRoute);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
