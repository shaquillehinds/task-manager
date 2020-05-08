const request = require("supertest");
const app = require("../server/app");
const User = require("../server/models/UserModel");
const Task = require("../server/models/TaskModel");
const { userOne, userOneId, taskOne, setupDatabase, userTwo } = require("./fixtures/db");

/*********************************TEAR DOWN *******************/

beforeEach(setupDatabase);

/************************************TESTS ********************/

test("Shoud create task for user", async () => {
  const res = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "create task test",
    })
    .expect(201);

  const task = await Task.findById(res.body._id);
  expect(task).not.toBeNull();
  expect(task.description).toBe("create task test");
  expect(task.completed).toBe(false);
});

test("Should get all tasks of userOne", async () => {
  const res = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(res.body.tasks.length).toBe(2);
  expect(res.body.count).toBe(2);
  expect(res.body.completed).toBe(1);
  expect(res.body.notCompleted).toBe(1);
});

test("should get only completed tasks", async () => {
  const res = await request(app)
    .get("/tasks?completed=true")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(res.body.tasks.length).toBe(1);
  expect(res.body.tasks[0].completed).toBe(true);
});

test("Should get a task by its id", async () => {
  const res = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(res.body.description).toBe("first task");
});

test("Shoud update a user's task", async () => {
  const res = await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ update: { completed: true } })
    .expect(202);

  const task = await Task.findById(taskOne._id);
  expect(task.completed).toBe(true);
});

test("Should delete a user's tasks", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const task = await Task.findById(taskOne._id);
  expect(task).toBeNull();
});

test("userTwo should fail to delete task of userOne", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
