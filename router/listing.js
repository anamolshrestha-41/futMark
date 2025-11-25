const express= require("express")
const router= express.Router();
const Listing= require("../models/listings")

//Read
router.get("/", async(req, res) => {
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
router.get("/new",(req, res)=>{
    res.render("listings/new.ejs");
})

router.post("/", async(req, res)=>{
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
                req.flash("success", "Match created successfully!")

        res.redirect("/listings");

    }
    catch(err){
          console.error("Database Error:", err.message);
        // Fallback with empty array if database fails
        res.render("listings/index.ejs", { allListings: [] });
    }
})

//edit listing
router.get("/:id/edit", async(req, res)=>{
    let {id}= req.params;
    await Listing.findById(id).then((listing)=>{
        res.render("listings/edit.ejs", {listing})
    }). catch((err)=>{
        res.redirect("/listings")
    })
})

router.put("/:id", async(req,res)=>{
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

router.delete("/:id", async(req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

module.exports=router;