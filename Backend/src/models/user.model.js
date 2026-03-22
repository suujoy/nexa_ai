import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isAdmin: {
            type: Boolean,
            default: false,
        },

        tokenCredits: {
            type: Number,
            default: 0,
        },

        tokenDailyLimit: {
            type: Number,
            default: 10,
        },

        defaultAiModel: {
            type: String,
            default: "groq",
        },

        theme: {
            type: String,
            enum: ["light", "dark"],
            default: "light",
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password, 10);
    
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
