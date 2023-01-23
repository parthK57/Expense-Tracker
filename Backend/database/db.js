const mysql = require("mysql2");

const connectionPool = mysql.createPool({
  user: "root",
  database: "expensetracker",
  host: "localhost",
  password: "2603",
});

module.exports = connectionPool;
