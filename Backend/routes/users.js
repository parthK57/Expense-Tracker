const express = require("express");

const router = express.Router();

// CONTROLLERS
const users = require("../controllers/users");

router.post("/postuser", users.postUserHandler);

module.exports = router;