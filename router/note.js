const express= require("express")
const router= express.Router();
const Note= require("../models/notes");

//notes: like phone numbers and blablabla...
//Read
router.get("/", async(req, res) => {
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
router.get("/new", (req, res)=>{
    res.render("notes/create.ejs");
})
router.post("/", async (req,res)=>{
try{
        let{title, description}= req.body;
        let newNote= new Note({
            title: title,
            description: description
        });
        await newNote.save();
        req.flash("success", "Note created successfully!")
        res.redirect("/notes");
} catch(err){
     console.error("Database Error:", err.message);
        // Fallback with empty array if database fails
        res.render("notes/home.ejs", { allNotes: [] });
}
})

//edit
router.get("/:id/edit",async(req,res)=>{
    let {id}= req.params;
    await Note.findById(id).then((note)=>{
        res.render("notes/editNote.ejs", {note});
    }).catch((err)=>{
        res.redirect("/notes")
    })
})
router.put("/:id", async(req, res)=>{
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
router.delete("/:id", async(req,res)=>{
    let {id}= req.params;
    await Note.findByIdAndDelete(id);
    res.redirect("/notes");
})

module.exports=router;