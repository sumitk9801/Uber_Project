const dotenv = require("dotenv").config();
const http = require("http");
const app = require("./app");
const Server = http.createServer(app);
const ConnectDB  = require("./db/db.js");
ConnectDB();

const port = process.env.PORT||3000;

Server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

Server.on("error",(error)=>{
    console.log(error)
})