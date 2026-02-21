const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CaptainSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true,
            minlength:[3,"First name must be at least 3 characters long"]
        },
        lastName:{
            type:String,
            minlength:[3,"Last name must be at least 3 characters long"]
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid email"]

    },
    password:{
        type:String,
        required:true,
        select:false,
        minlength:[6,"Password must be at least 6 characters long"]
    },
    role:{
        type:String,
        enum:["captain"],
        default:"captain"
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:"inactive"
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3,"Color must be at least 3 characters long"]
        },
        plateNumber:{
            type:String,
            required:true,
            minlength:[3,"Plate number must be at least 3 characters long"]
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,"Capacity must be at least 1"]
        },
        vehicleType:{
            type:String,
            required:true,
            enum:["car","bike","auto"]
        }
    },
    location:{
        lat:{
            type:Number,
        },
        lng:{
            type:Number,
        }
    },
    rating:{
        type:Number,
        default:0,
        min:0,
        max:5
    },
    totalRides:{  
        type:Number,
        default:0
    },
    earnings:{
        type:Number,
        default:0
    },
    documents:{
        license:{
            type:String,
            required:true
        },
        registration:{
            type:String,
            required:true
        },
        insurance:{
            type:String,
            required:true
        }
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    deletedAt:{
        type:Date,
        default:null
    }
})


CaptainSchema.methods.generateAuthToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:"24h"});
}

CaptainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

CaptainSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,11);
}
const captainModel = mongoose.model('Captain',CaptainSchema)

module.exports = captainModel;