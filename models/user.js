const mongoose= require("mongoose");
const { type } = require("os");

const Schema= mongoose.Schema;

const userSchema= new Schema({
    username:{
        type: String,
        require:[true, "Your name"],
        unique:true,
        trim: true,
        minLength: 3,
        lowercase:true
    },
    password:{
        type: String,
        require:[true, "Your password"],
        minLength: 8
    },
    email:{
        type: String,
        require:[true, "Your email"],
        unique:true,
        trim: true,
        lowercase:true
    }
})
module.exports= mongoose.model("User", userSchema);