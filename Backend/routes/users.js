const express = require("express");

const router = express.Router();

// CONTROLLERS
const users = require("../controllers/users");

router.post("/postuser", users.postUserHandler);
router.post("/login", users.loginHandler);
router.post("/verifyUser", users.verifyUserHandler);
router.post("/premium/leaderBoard", users.leaderBoardHandler);
router.post("/resetpasswordrequsthandler", users.resetPasswordRequestHandler);
router.get("/resetpasswordform/:id", users.resetPasswordFormHandler);
router.get("/updatepassworddetails", users.passwordResetExecuteHandler);

module.exports = router;