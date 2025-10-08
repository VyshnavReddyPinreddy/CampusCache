import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    contentType: {
        type: String,
        required: true,
        enum: ["Answer", "Comment"]
    },
    voteType: {
        type: Number // Should be 1 for upvote, -1 for downvote
    }
});

export default mongoose.model("Vote", voteSchema);