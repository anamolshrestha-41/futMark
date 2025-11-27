const express= require("express")
const router= express.Router();
const Note= require("../models/notes");
const noteController= require("../controllers/note")
const warpAsync= require("../utils/warpAsync")
//Read
router.route("/").get(warpAsync(noteController.home)).post(warpAsync(noteController.addNote))
//create
router.get("/new", warpAsync(noteController.createNote) )
router.route("/:id").put(warpAsync(noteController.updateNote)).delete(warpAsync(noteController.deleteNote))
router.get("/:id/edit", warpAsync(noteController.editNote))


module.exports=router;