const mongoose = require("mongoose");
 
const ConnectDB = async()=>{
    await mongoose.connect(`${process.env.MONGODB_URI}`).then(()=>{
        console.log("Database connected successfully");
    })
    .catch((err)=>console.log(err.message))
}
module.exports = ConnectDB;