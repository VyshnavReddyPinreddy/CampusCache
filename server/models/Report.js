import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    contentType: {
        type: String,
        required: true,
        enum: ["Question", "Answer", "Comment"]
    },
    reportedBy: {
        type: String, // Corrected from Stirng
        required: true,
        ref: "User"
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Resolved"],
        default: "Pending" // Added a default status
    }
});

export default mongoose.model("Report", reportSchema);