const mysql = require("mysql2");

const connectionPool = mysql.createPool({
  user: "root",
  database: "expensetracker",
  host: "localhost",
  password: process.env.MYSQL_PASSWORD,
});

module.exports = connectionPool;
