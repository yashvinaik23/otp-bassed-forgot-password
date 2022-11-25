const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://proTeast:proteastacc@cluster0.znultjc.mongodb.net/test",
  {
    useNewUrlParser: true,
  },
  console.log("server is started...")
);
