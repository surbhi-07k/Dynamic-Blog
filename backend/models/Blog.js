
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
    },
    { timestamps: true }
);

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        mediaType: {
            type: String,
            enum: ["image", "gif", "video"],
            default: "image",
        },
        mediaUrl: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        likes: {
            type: [String],
            default: [],
        },
        comments: {
            type: [commentSchema],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
