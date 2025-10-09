import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        required: true 
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    updated: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date, // Corrected from Date()
        default: Date.now
    }
});

export default mongoose.model("Question", questionSchema);