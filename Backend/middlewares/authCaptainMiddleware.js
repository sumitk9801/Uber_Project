const captainModel = require("../models/CaptainModel");
const jwt = require("jsonwebtoken");
const BlacklistModel = require("../models/blacklistModel");


const authCaptain = async(req,res,next)=>{
    try{
    const token = req.cookies.token||req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    const isBlacklisted = await BlacklistModel.findOne({token});
    if(isBlacklisted){
        return res.status(401).json({message:"Unauthorized"})
    }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const captain = await captainModel.findById(decoded._id);
    
        if(!captain){
            return res.status(401).json({message:"Unauthorized"})
        }
        if(captain.role !== "captain"){
            return res.status(401).json({message:"Unauthorized"})
        }
       req.captain = captain;
       next();
    }
    catch(error){
        console.log(error.message);
        return res.status(401).json({message:"Unauthorized"})
    }
}
module.exports = authCaptain;
