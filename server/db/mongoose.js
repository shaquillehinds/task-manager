const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_TEST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Unable to connect"));
