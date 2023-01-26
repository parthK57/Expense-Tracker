const express = require("express");

const router = express.Router();

// CONTROLLERS
const expenses = require("../controllers/expenses");

router.post("/postexpense", expenses.postExpenseHandler);
router.post("/getexpenses", expenses.getExpensesHandler);
router.post("/deleteexpense", expenses.deleteExpensesHandler);
router.post("/premium/getUserData", expenses.getUserDataHandler);

module.exports = router;