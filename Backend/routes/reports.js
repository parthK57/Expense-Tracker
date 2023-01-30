const express = require("express");

const router = express.Router();

// CONTROLLERS
const reports = require("../controllers/reports");

router.get("/reports", reports.getReportsHandler);
router.get("/savereport", reports.saveReportsHandler);

module.exports = router;