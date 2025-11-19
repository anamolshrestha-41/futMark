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

//model
const Listing= require("./models/listings");
const Note=require("./models/notes")

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

app.get("/",(req, res)=>{
    res.send("Add /listings at top url for homepage.")
})

//Read
app.get("/listings", async(req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error("Database Error:", err.message);
        // Fallback with empty array if database fails
        res.render("listings/index.ejs", { allListings: [] });
    }
});

//Create
app.get("/listings/new",(req, res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings", async(req, res)=>{
    try{
        let {title, description, time, date, place, players}= req.body;
        let newListing= new Listing({
            title: title,
            description: description,
            time: time,
            date:date,
            place: place,
            listOfPlayers: players ? players.split(",").map(p => p.trim()) : []
        });
        await newListing.save();
        res.redirect("/listings");

    }
    catch(err){
          console.error("Database Error:", err.message);
        // Fallback with empty array if database fails
        res.render("listings/index.ejs", { allListings: [] });
    }
})

//edit listing
app.get("/listings/:id/edit", async(req, res)=>{
    let {id}= req.params;
    await Listing.findById(id).then((listing)=>{
        res.render("listings/edit.ejs", {listing})
    }). catch((err)=>{
        res.redirect("/listings")
    })
})

app.put("/listings/:id", async(req,res)=>{
    try {
        let {id} = req.params;
        let {listing} = req.body;
        
        // Handle players array conversion
        if (listing.listOfPlayers && typeof listing.listOfPlayers === 'string') {
            listing.listOfPlayers = listing.listOfPlayers.split(',').map(p => p.trim()).filter(Boolean);
        }
        
        await Listing.findByIdAndUpdate(id, listing);
        res.redirect("/listings");
    } catch(err) {
        console.error("Update Error:", err.message);
        res.redirect("/listings");
    }
})

app.delete("/listings/:id", async(req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

//notes: like phone numbers and blablabla...
//Read
app.get("/notes", async(req, res) => {
    try {
        const allNotes = await Note.find({});
        res.render("notes/Home.ejs", { allNotes });
    } catch (err) {
        console.error("Database Error:", err.message);
        // Fallback with empty array if database fails
        res.render("notes/Home.ejs", { allNotes: [] });
    }
});
//create
app.get("/notes/new", (req, res)=>{
    res.render("notes/create.ejs");
})
app.post("/notes", async (req,res)=>{
try{
        let{title, description}= req.body;
        let newNote= new Note({
            title: title,
            description: description
        });
        await newNote.save();
        res.redirect("/notes");
} catch(err){
     console.error("Database Error:", err.message);
        // Fallback with empty array if database fails
        res.render("notes/home.ejs", { allNotes: [] });
}
})

//edit
app.get("/notes/:id/edit",async(req,res)=>{
    let {id}= req.params;
    await Note.findById(id).then((note)=>{
        res.render("notes/editNote.ejs", {note});
    }).catch((err)=>{
        res.redirect("/notes")
    })
})
app.put("/notes/:id", async(req, res)=>{
    try{
        let {id}= req.params;
        let {note}= req.body;
        await Note.findByIdAndUpdate(id, note);
        res.redirect("/notes")
    }catch(err){
        console.error("Update Error:", err.message);
        res.redirect("/notes");
    }
})
//delete
app.delete("/notes/:id", async(req,res)=>{
    let {id}= req.params;
    await Note.findByIdAndDelete(id);
    res.redirect("/notes");
})


app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
