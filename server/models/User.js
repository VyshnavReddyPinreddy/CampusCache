import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Student", "Admin"],
        default: "Student"
    },
    points: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationOtp: String,
    verificationOtpExpires: Date,
    passwordResetOtp: String,
    passwordResetOtpExpires: Date,
});

// Pre-save hook to hash password
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

export default mongoose.model("User", userSchema);