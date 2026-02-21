const captainModel = require("../models/CaptainModel");
const BlackListToken = require("../models/blacklistModel");
const {validationResult} = require("express-validator");
const {createCaptain} = require("../services/captainService");

//Register
const registerCaptain = async(req,res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const {fullName,vehicle,documents,email,password,location} = req.body;
        const captain = await captainModel.findOne({email});
        if(captain){
            return res.status(400).json({message:"Captain already exists"})
        }
        const newCaptain = await createCaptain({
           firstName:fullName.firstName,
           lastName:fullName.lastName,
           email,
           password,
           color:vehicle.color,
           plateNumber:vehicle.plateNumber,
           capacity:vehicle.capacity,
           vehicleType:vehicle.vehicleType,
           license:documents.license,
           registration:documents.registration,
           insurance:documents.insurance,
           lat:location?.lat,
           lng:location?.lng
        });
        
        return res.status(201).json({message:"Captain created successfully",newCaptain})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({message:"Internal server error", error: error.message})
    }
}

//login
const loginCaptain = async(req,res)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const {email,password} = req.body;

        const captain = await captainModel.findOne({email}).select("+password");
        if(!captain){
            return res.status(401).json({message:"Invalid Credentials"})
        }
        const isCorrectpassword = await captain.comparePassword(password);

        if(!isCorrectpassword){
            return res.status(401).json({message:"Invalid Credentials"})
        }

        const token = captain.generateAuthToken();
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:24*60*60*1000
        })

        return res.status(200).json({message:"Captain logged in successfully",captain})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message:"Internal server error", error: error.message})
    }
}

//logout
const logoutCaptain = async(req,res)=>{
    try{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    res.clearCookie("token");
    const blacklistedToken = await BlackListToken.create({token});
    return res.status(200).json({message:"Captain logged out successfully"});
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({message:"Internal server error", error: error.message})
    }
}

//profile
const getCaptainProfile = async(req,res)=>{
    try{
    const captain = req.captain;
    return res.status(200).json({captain});
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({message:"Internal server error", error: error.message})
    }
}

module.exports = {registerCaptain,loginCaptain,logoutCaptain,getCaptainProfile};