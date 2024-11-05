const express = require("express");
const connectDB = require("./config/db");
const { errorHandler } = require("./middlewares/error");
const cors = require("cors");
require("dotenv").config();
const path = require('path');
const sheikh=require("./routes/sheikh")
connectDB();

const app = express();

const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/sheikh",sheikh)
app.use("/auth", require("./routes/auth"));
app.use("/collectData",require("./routes/collectdata"))

app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server started listening on ${PORT}`)
);

process.on("unhandledRejection", (error, promise) => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1));
});
