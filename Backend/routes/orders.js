const express = require("express");

const router = express.Router();

// CONTROLLERS
const orders = require("../controllers/orders");

router.post("/getorderid", orders.getOrderHandler);
router.post("/transactionstatus", orders.postTransactionStatusHandler);

module.exports = router;