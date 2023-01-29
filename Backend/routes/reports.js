const express = require("express");

const router = express.Router();

// CONTROLLERS
const reports = require("../controllers/reports");

router.get("/reports/users", reports.getReportsHandler);

module.exports = router;