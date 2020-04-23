require("../src/db/mongoose");
const Task = require("../src/models/Task");

//ObjectId("5ea1b72c618eef36887f6361")

// Task.findByIdAndDelete("5e9f4a2ba663da0f7868d238")
//   .then((deleted) => {
//     console.log(deleted);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((docs) => console.log(docs))
//   .catch((e) => console.log(e));

const deleteTask = async (id, completed) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed });
  return { task, count };
};
deleteTask("5ea1b72c618eef36887f6360", false)
  .then((res) =>
    console.log(`Task deleted: ${res.task} and count: ${res.count}`)
  )
  .catch((e) => console.log(e));
