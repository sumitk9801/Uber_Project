const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true,
            minlength :[3,"must be three characters or long"]
        },
        lastName:{
            type:String,
            minlength :[3,"must be three characters or long"]
        }
    },
    email:{
        type:String,
        required: true,
        unique:true,
        minlength :[5,"Email must be five characters or long"]
    },
    password:{
        type:String,
        required:true, 
        select:false
    },
    socketId:{
        type:String,
        default:""
    }
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"1d"})
    return token;
}
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}    
userSchema.statics.hashpassword = async(password)=>{
    return await bcrypt.hash(password,11);
}
module.exports = mongoose.model("User",userSchema)