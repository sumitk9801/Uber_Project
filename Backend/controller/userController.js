const User = require("../models/UserModel");
const userService = require("../services/userService");
const {validationResult} = require("express-validator");

const loginUser=async(req,res)=>{
    try{
        //Validation
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        //Destructure
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All Fields are required"});
        }
        //Find User
        const user = await User.findOne({email}).select("+password");
        if(!user) return res.json({status:401,message:"Invalid Credentials"});

        //Compare Password
        const isCorrectpassword = await user.comparePassword(password);
        if(!isCorrectpassword) return res.json({status:401,message:"Invalid Credentials"});
    
        //Generate Token
        const token = user.generateAuthToken();
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:15*60*60*1000
        })
        return res.status(200).json({message:"User logged in successfully",user})
    }
    catch(error){
        console.log(error.message)
    }
}





const registerUser=async(req,res,next)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const {fullName,email,password} = req.body;
        const hashedPassword = await User.hashpassword(password);
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"})
        }
        const newUser = await userService.createUser(
            {firstName:fullName.firstName,
                lastName:fullName.lastName,
                email,
                password:hashedPassword
            });
        const token = newUser.generateAuthToken();
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:15*60*60*1000
        })
        return res.status(201).json({message:"User created successfully",newUser})
    }
    catch(error){
        console.log(error.message)
    }
}
module.exports = {registerUser,loginUser}