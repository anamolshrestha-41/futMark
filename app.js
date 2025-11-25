const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL;
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ejs = require("ejs");
const flash= require("connect-flash");
const expressSession= require("express-session");

//model
const Listing= require("./models/listings");
const Note=require("./models/notes");
//error handler
const ExpressError = require("./utils/ExpressError");

//router
const listingRouter= require("./router/listing");
const noteRouter= require("./router/note");

main()
.then(() => {
    console.log("MongoDB Connected Successfully...");
})
.catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    console.log("App will continue without database connection");
});

async function main(){
    await mongoose.connect(dbUrl);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//session
const sessionOptions=({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
})



app.use(expressSession(sessionOptions));

//flash
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})


// app.get("/",(req, res)=>{
//     res.send("Add /listings at top url for homepage.")
// })


app.use("/listings", listingRouter);
app.use("/notes", noteRouter);

app.get("/",(req, res)=>{
    res.redirect("/listings")
})

app.all(/.*/, (req, res, next)=>{
    next(new ExpressError ("Page not found!", 404));
})

app.use((err, req, res, next)=>{
    let { statusCode=500, message="Something Went Wrong!!"}= err;
    res.status(statusCode).render("error.ejs", {err});
})

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
