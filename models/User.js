const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
    
name:{
    type:String,
    required:true,
    trim:true
},

    email:{String,
    required:true,
    unique:true,
    trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        emum:['user','admin'],
        default:'user'
    }
},
    {
        timestamps:true
    }
);
module.exports=mongoose.model("User",userSchema);
