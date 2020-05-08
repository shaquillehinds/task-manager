const request = require("supertest");
const app = require("../server/app");
const User = require("../server/models/UserModel");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

/************************************TESTS ********************/

beforeEach(setupDatabase);

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

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ update: { name: "Deborah", email: "deborah@example.com" } })
    .expect(202);

  const user = await User.findById(userOneId);

  expect(user.email).toEqual("deborah@example.com");
});

test("should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ update: { location: "Bahamas" } })
    .expect(400);
});
