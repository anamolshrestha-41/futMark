const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const notesSchema= new Schema({
        title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },

    description: {
        type: String,
        required: [true, "Description is required"],
        default: "Any Description...",
        trim: true
    },
})

const Note= mongoose.model("Note", notesSchema);
module.exports=Note;