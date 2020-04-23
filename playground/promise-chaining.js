require("../src/db/mongoose");
const User = require("../src/models/User");

// User.findByIdAndUpdate("5e9f501b4726dd2360728166", { age: 1 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 0 });
//   })
//   .then((users) => console.log(users))
//   .catch((e) => console.log(e));

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age: 2 });
  const count = await User.countDocuments({ age });
  const results = { user, count };
  return results;
};
updateAgeAndCount("5e9f501b4726dd2360728166", 0)
  .then((res) => console.log(res.user))
  .catch((e) => console.log(e));
