const request = require("supertest");
const app = require("../server/app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../server/models/UserModel");

/*********************************TEAR DOWN *******************/

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Dina",
  email: "dina@example.com",
  password: "dinaking",
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }],
};

beforeEach(async () => {
  await User.deleteMany();
  const user = await new User(userOne);
  user.save();
});

/************************************TESTS ********************/

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Shaquille",
      email: "shaquille@example.com",
      password: "shaquilleking",
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response

  expect(response.body).toMatchObject({
    user: {
      name: "Shaquille",
      email: "shaquille@example.com",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("shaquilleking");
});

test("Should be able to login", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findById({ _id: response.body.user._id });
  expect(response.body.newToken).toBe(user.tokens[1].token);
});

test("should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "shaquille@example.com",
      password: "shaquilleking",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauth user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(user).toBeNull();
});
test("Should not delete for unauth user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});
