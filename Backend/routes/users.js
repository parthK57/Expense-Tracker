const express = require("express");

const router = express.Router();

// CONTROLLERS
const users = require("../controllers/users");

router.post("/postuser", users.postUserHandler);
router.post("/login", users.loginHandler);
router.post("/verifyUser", users.verifyUserHandler);
router.post("/premium/leaderBoard", users.leaderBoardHandler);
router.post("/resetPassword", users.resetPasswordHandler);
router.post("/resetpassword/updateddetails", users.updateDetailsHandler);
router.get("/resetpassword/:id", users.passwordGenerator);

module.exports = router;