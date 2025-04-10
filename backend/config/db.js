const mongoose = require("mongoose");

const db = () => {
  mongoose
    .connect("mongodb://localhost:27017/e-com")
    .then(() => {
      console.log("mongoDB cennected !!!!");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = db;
