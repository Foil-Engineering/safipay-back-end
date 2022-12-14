const express = require('express');
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());


const authRoutes = require("./routes/auth");
const billRoutes = require("./routes/bill");
const userRoutes = require("./routes/user");

dotenv.config();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser : true})
    .then(() => {
        console.log("Connection to the database was successful");
    });
mongoose.connection.on("error",err => {
    console.log("Unable to connect to the database");
});

app.use(authRoutes);
app.use(billRoutes);
app.use(userRoutes);

app.listen(port, () => {
  console.log(`Server running on ${port}!`);
});