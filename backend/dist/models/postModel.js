"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    postType: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    media: {
        type: [],
        required: false,
    },
    fixture: {
        type: Object,
        required: false,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    replyingTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: false,
    },
    likedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    repliedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    repostedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
}, { timestamps: true });
postSchema.virtual("likeCount").get(function () {
    return this.likedBy.length;
});
postSchema.virtual("replyCount").get(function () {
    return this.repliedBy.length;
});
postSchema.virtual("repostCount").get(function () {
    return this.repostedBy.length;
});
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });
const Post = (0, mongoose_1.model)("Post", postSchema);
exports.Post = Post;
