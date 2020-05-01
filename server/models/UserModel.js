const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./TaskModel");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("This is not a valid email");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password must not contain the word 'password'");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.statics.findByCredentials = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Unable to login with email");
    }
    const verified = await bcrypt.compare(password, user.password);
    if (!verified) {
      throw new Error("Unable to login with password");
    }

    return user;
  } catch (e) {
    return e;
  }
};

userSchema.methods.generateAuthToken = async function () {
  const _id = this._id.toString();
  const token = jwt.sign({ _id }, process.env.JWT_SECRET);

  this.tokens.push({ token });
  await this.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const { age, _id, name, email, __v } = this;
  return { age, _id, name, email, __v };
};

//hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

//Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  await Task.deleteMany({ owner: this._id });
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
