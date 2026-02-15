const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/users",userRouter);


app.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = app;
