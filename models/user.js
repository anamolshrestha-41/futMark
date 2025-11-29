const mongoose= require("mongoose");
const Listing= require("./listings.js")
const Note= require("./notes.js");
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

userSchema.post("findOneAndDelete", async(user)=>{
    if(user){
        await Listing.deleteMany({owner: user._id});
        await Note.deleteMany({owner: user._id});
        console.log("User and associated listings and notes deleted");
    }
})

const User= mongoose.model("User", userSchema);
module.exports= User;

