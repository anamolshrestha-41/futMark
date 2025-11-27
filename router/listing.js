const express= require("express")
const router= express.Router();
const Listing= require("../models/listings")
const warpAsync= require("../utils/warpAsync")
const listingController= require("../controllers/listing")

router.route("/")
.get(warpAsync(listingController.index))
.post(
    warpAsync(listingController.createListing));
//Create
router.get("/new", listingController.new_listing)

router.route("/:id" )
.put(warpAsync(listingController.updateListing))
.delete(warpAsync(listingController.deleteListing))

//edit listing
router.get("/:id/edit", listingController.editListing)

module.exports=router;