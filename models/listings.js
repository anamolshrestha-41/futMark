const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const listingSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },

    description: {
        type: String,
        required: [true, "Description is required"],
        default: "Dreams Sindhu Futsal",
        trim: true
    },

    time: {
        type: String,
        required: [true, "Time is required"],
        default: "2-3 PM",
        trim: true
    },

    date: {
        type: Date,
        required: [true, "Date is required"],
        validate: {
            validator: function (value) {
                // Must be today or future date
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return value >= today;
            },
            message: "Date cannot be earlier than today."
        }
    },

    place: {
        type: String,
        required: [true, "Place is required"],
        trim: true
    },

    listOfPlayers: {
        type: [String],
        default: []
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Listing= mongoose.model("Listing", listingSchema);
module.exports= Listing;