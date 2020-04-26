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

// const Task = require("./models/Task");
// const User = require("./models/User");

// const main = async () => {
//   const task = await Task.findById("5ea4e39f996eb25378ff6484");
//   await task.populate("owner").execPopulate();
//   console.log(task.owner);

//   const user = await User.findById("5ea4e395996eb25378ff6482");
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);
// };
// main();
