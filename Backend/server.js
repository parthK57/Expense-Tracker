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

app.use(postUserRoute);
app.use(loginRoute);

app.listen(5000, () => console.log("Server live at: http://localhost:5000"));
