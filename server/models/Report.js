import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'contentType'
    },
    contentType: {
        type: String,
        required: true,
        enum: ["Question", "Answer"]
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    reasons: [{
        type: String,
        required: true,
        enum: ['Spam', 'Hate Speech', 'Explicit Content', 'Misinformation', 'Harassment']
    }],
    status: {
        type: String,
        enum: ["Pending", "In Progress","Resolved"],
        default: "Pending"
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    actionTaken: {
        type: String,
        enum: ['Content Deleted', 'No Action Needed'],
    },
    adminNotes: {
        type: String
    },
    resolvedAt: {
        type: Date
    }
});

export default mongoose.model("Report", reportSchema);