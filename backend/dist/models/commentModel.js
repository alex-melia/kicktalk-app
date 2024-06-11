"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    commentType: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    fixtureId: {
        type: String,
        required: false,
    },
    playerId: {
        type: String,
        required: false,
    },
    fixtureMinute: {
        type: Number,
        required: false,
    },
    upvotes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    downvotes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
}, { timestamps: true });
commentSchema.virtual("voteCount").get(function () {
    return this.upvotes.length - this.downvotes.length;
});
commentSchema.set("toJSON", { virtuals: true });
commentSchema.set("toObject", { virtuals: true });
const Comment = (0, mongoose_1.model)("Comment", commentSchema);
exports.Comment = Comment;
