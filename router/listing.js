const express= require("express")
const router= express.Router();
const Listing= require("../models/listings")
const warpAsync= require("../utils/warpAsync")
const listingController= require("../controllers/listing");
const { isOwner, isLoggedIn } = require("../middleware/auth");

router.route("/")
.get(warpAsync(listingController.index))
.post(isLoggedIn, warpAsync(listingController.createListing));

//Create
router.get("/new", isLoggedIn, listingController.new_listing)

router.route("/:id" )
.put(isLoggedIn, isOwner, warpAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, warpAsync(listingController.deleteListing))

//edit listing
router.get("/:id/edit", isLoggedIn, isOwner, listingController.editListing)

module.exports=router;