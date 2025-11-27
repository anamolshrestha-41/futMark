const Note=require("../models/notes")

exports.home=async(req, res) => {
    try {
        const allNotes = await Note.find({});
        res.render("notes/Home.ejs", { allNotes });
    } catch (err) {
        console.error("Database Error:", err.message);
        // Fallback with empty array if database fails
        res.render("notes/Home.ejs", { allNotes: [] });
    }
}

exports.createNote=(req, res)=>{
    res.render("notes/create.ejs");
}
exports.addNote= async (req,res)=>{
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
}

exports.editNote=async(req,res)=>{
    let {id}= req.params;
    await Note.findById(id).then((note)=>{
        res.render("notes/editNote.ejs", {note});
    }).catch((err)=>{
        res.redirect("/notes")
    })
}

exports.updateNote= async(req, res)=>{
    try{
        let {id}= req.params;
        let {note}= req.body;
        await Note.findByIdAndUpdate(id, note);
        res.redirect("/notes")
    }catch(err){
        console.error("Update Error:", err.message);
        res.redirect("/notes");
    }
}

exports.deleteNote= async(req,res)=>{
    let {id}= req.params;
    await Note.findByIdAndDelete(id);
    res.redirect("/notes");
}