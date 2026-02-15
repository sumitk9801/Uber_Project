const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlacklistModel = require("../models/blacklistModel");


const authUser = async(req,res,next)=>{
    const token = req.cookies.token||req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    const isBlacklisted = await BlacklistModel.findOne({token});
    if(isBlacklisted){
        return res.status(401).json({message:"Unauthorized"})
    }
    try{
       const decoded = jwt.verify(token,process.env.JWT_SECRET);
       const user = await User.findById(decoded._id);
       if(!user){
           return res.status(401).json({message:"Unauthorized"})
       }
       req.user = user;
       next();
    }
    catch(error){
        console.log(error.message);
        return res.status(401).json({message:"Unauthorized"})
    }
}
module.exports = authUser;
