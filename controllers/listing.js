const Listing = require("../models/listings")

exports.index= async(req, res) => {
    try {
        const allListings = await Listing.find({}).populate('owner');
        res.render("listings/index.ejs", { 
            allListings,
            currentUser: res.locals.currentUser 
        });
    } catch (err) {
        console.error("Database Error:", err.message);
        res.render("listings/index.ejs", { 
            allListings: [],
            currentUser: res.locals.currentUser 
        });
    }
}

exports.new_listing=(req, res)=>{
    res.render("listings/new.ejs", { currentUser: res.locals.currentUser });
}

exports.createListing=async(req, res)=>{
    try{
        let {title, description, time, date, place, players}= req.body;
        let newListing= new Listing({
            title: title,
            description: description,
            time: time,
            date:date,
            place: place,
            listOfPlayers: players ? players.split(",").map(p => p.trim()) : [],
            owner: req.user._id
        });
        await newListing.save();
        req.flash("success", "Match created successfully!")
        res.redirect("/listings");
    }
    catch(err){
        console.error("Database Error:", err.message);
        req.flash("error", "Failed to create match!");
        res.redirect("/listings/new");
    }
}

exports.editListing=async(req, res)=>{
    let {id}= req.params;
    await Listing.findById(id).then((listing)=>{
        res.render("listings/edit.ejs", {
            listing,
            currentUser: res.locals.currentUser
        })
    }). catch((err)=>{
        res.redirect("/listings")
    })
}

exports.updateListing=async(req,res)=>{
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
}

exports.deleteListing=async(req, res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}