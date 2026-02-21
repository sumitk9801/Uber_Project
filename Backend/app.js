const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const captainRouter = require("./routes/captainRouter");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URI,
    credentials: true
})); //enable cors
app.use(express.json()); //parse the json
app.use(express.urlencoded({extended:true})); //parse the urlencoded
app.use(cookieParser()); //read the cookie

//API ENDPOINTS
app.use("/api/users",userRouter); //user router
app.use("/api/captains",captainRouter); //captain router


app.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = app;
