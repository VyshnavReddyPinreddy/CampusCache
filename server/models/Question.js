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
        type: Date,
        default: Date.now
    }
});

// Add text indexes for better search capabilities
questionSchema.index({ 
    title: 'text', 
    tags: 'text'
}, {
    weights: {
        title: 10,    // Title matches are most important
        tags: 8       // Tag matches are more important than content but less than title
    },
    name: "QuestionTextIndex"
});

export default mongoose.model("Question", questionSchema);