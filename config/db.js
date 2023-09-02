const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

exports.dbConnection = () => {
  mongoose
    .connect(process.env.DATABASE_CONNECT)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.error(`Connection Error : ${err}`);
      process.exit(1);
    });
};
