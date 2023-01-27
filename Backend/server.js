const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// ROUTES
const postUserRoute = require("./routes/users");
const loginRoute = require("./routes/users");
const postExpenseRoute = require("./routes/expenses");
const getExpensesRoute = require("./routes/expenses");
const deleteExpenseRoute = require("./routes/expenses");
const orderGenerationRoute = require("./routes/orders");
const handleTransactionRoute = require("./routes/orders");
const verifyUserRoute = require("./routes/users");
const getUserDataRoute = require("./routes/expenses");
const generateLBRoute = require("./routes/users");
const resetPasswordRoute = require("./routes/users");
const passwordGeneratorRoute = require("./routes/users");
const updatePasswordRoute = require("./routes/users");

app.use(postUserRoute);
app.use(loginRoute);
app.use(postExpenseRoute);
app.use(getExpensesRoute);
app.use(deleteExpenseRoute);
app.use(orderGenerationRoute);
app.use(handleTransactionRoute);
app.use(verifyUserRoute);
app.use(getUserDataRoute);
app.use(generateLBRoute);
app.use(resetPasswordRoute);
app.use(passwordGeneratorRoute);
app.use(updatePasswordRoute);

app.listen(5000, () => console.log("Server live at: http://localhost:5000"));
