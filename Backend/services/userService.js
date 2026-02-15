const User = require("../models/UserModel");

module.exports.createUser = async({firstName,lastName,email,password})=>{
    try{
       if(!firstName || !email || !password){
        return {status: 400,message:"All fields are required"}
       }
        const newUser = await User.create({
            fullName:{
                firstName:firstName,
                lastName:lastName
            },
            email:email,
            password:password,
        });
        return newUser
    }catch(error){
        console.log(error.message)
    }
}

