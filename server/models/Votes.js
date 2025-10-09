import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    answerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Answer"
    },
    voteType: {
        type: Number // Should be 1 for upvote, -1 for downvote
    }
});

export default mongoose.model("Vote", voteSchema);