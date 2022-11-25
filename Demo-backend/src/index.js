const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const userRouter = require("./Routers/user");

require("./database/mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(userRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
