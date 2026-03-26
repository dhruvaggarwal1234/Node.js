import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "users",
        require: true,
    },

    refreshToken: {
        type: String,
        require: true,
    },
    ip: {
        type: String,
        require: true,
    },

    userAgent: {
        type: String,
        require: true,
    },

    revoke: {
        type: Boolean,
        default: false,
    }



}, { timestamps: true })

const sessionModel = mongoose.model("Session" ,sessionSchema );

export default sessionModel