const express= require("express")
const router= express.Router();
const Note= require("../models/notes");
const noteController= require("../controllers/note")
const warpAsync= require("../utils/warpAsync");
const { isOwner, isOwnerNote, isLoggedIn } = require("../middleware/auth");
//Read
router.route("/").get(isLoggedIn, warpAsync(noteController.home)).post(isLoggedIn, warpAsync(noteController.addNote))
//create
router.get("/new", isLoggedIn, noteController.createNote)
router.route("/:id").put(isLoggedIn, isOwnerNote, warpAsync(noteController.updateNote)).delete(isLoggedIn, isOwnerNote, warpAsync(noteController.deleteNote))
router.get("/:id/edit", isLoggedIn, isOwnerNote, noteController.editNote)


module.exports=router;