const User= require("../models/user")
const Listing= require("../models/listings")
const Note= require("../models/notes")
const ExpressError= require("../utils/ExpressError.js")
const jwt=require("jsonwebtoken")
const generateToken= require("../utils/generateToken.js")

module.exports.isLoggedIn= async (req, res, next)=>{
   const auth= req.cookies.token;
   if(!auth){
            req.flash("error", "Login First");
            return res.redirect("/user/login");
        }
        try{
         const decoded= jwt.verify(auth, process.env.JWT_SECRET);
         req.user= await User.findById(decoded.id);
         res.locals.currentUser= req.user;
         next();
        }
        catch(err){
            req.flash("error", "Session Expired, Please Login Again!");
            return res.redirect("/user/login");
        }
       
   }

module.exports.saveRedirectUrl= (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
   try {
       const {id}= req.params;
       const listing= await Listing.findById(id);
       if(!listing || !listing.owner || !listing.owner.equals(req.user._id)){
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings`);
       }
       next();
   } catch(err) {
       req.flash("error", "Something went wrong!");
       return res.redirect(`/listings`);
   }
}

module.exports.isOwnerNote= async(req, res, next)=>{
    try {
        const {id}= req.params;
        const note= await Note.findById(id);
        if(!note || !note.owner || !note.owner.equals(req.user._id)){
         req.flash("error", "You are not the owner of this note!");
         return res.redirect(`/notes`);
        }
        next();
    } catch(err) {
        req.flash("error", "Something went wrong!");
        return res.redirect(`/notes`);
    }
 }