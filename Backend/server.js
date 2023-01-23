const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ROUTES
const postUserRoute = require("./routes/users");

app.use(postUserRoute);

app.listen(5000, () => console.log("Server live at: http://localhost:5000"));
