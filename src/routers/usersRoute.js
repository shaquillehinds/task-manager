const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router
  .route("/me")
  .get(auth, async (req, res) => {
    res.send(req.user);
  })
  .patch(auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const valid = updates.every((update) => allowedUpdates.includes(update));
    if (!valid) {
      return res.status(400).send("Invalid update request");
    }
    try {
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      res.status(202).send(req.user);
    } catch (e) {
      res.status(400).send(e);
    }
  })
  .delete(auth, async (req, res) => {
    try {
      await req.user.remove();
      res.send(req.user);
    } catch (e) {
      res.status(500).send(e);
    }
  });

router.post("/login", async (req, res) => {
  if (req.header("authorization")) {
    var token = req.header("authorization").replace("Bearer ", "");
    var decoded = await jwt.verify(token, "theelectricuniverse");
  }

  try {
    const user = await User.findByCredentials(req.body);
    if (decoded) {
      const isLoggedIn = user.tokens.every((t) => t.token !== token);
      if (!isLoggedIn) {
        return res.status(400).send("Already logged in.");
      }
    }
    const newToken = await user.generateAuthToken();
    res.send({ user, newToken });
  } catch (e) {
    res.status(400).send("There was an error");
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    user = await req.user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    user = await req.user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;
