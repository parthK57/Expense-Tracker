const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// ROUTES
const postUserRoute = require("./routes/users");
const loginRoute = require("./routes/users");
const postExpenseRoute = require("./routes/expenses");
const getExpensesRoute = require("./routes/expenses");

app.use(postUserRoute);
app.use(loginRoute);
app.use(postExpenseRoute);
app.use(getExpensesRoute);

app.listen(5000, () => console.log("Server live at: http://localhost:5000"));
