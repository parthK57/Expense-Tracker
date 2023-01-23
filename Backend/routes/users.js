const express = require("express");

const router = express.Router();

// CONTROLLERS
const users = require("../controllers/users");

router.post("/postuser", users.postUserHandler);
router.post("/login", users.loginHandler);

module.exports = router;