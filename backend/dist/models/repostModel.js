"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repost = void 0;
const mongoose_1 = require("mongoose");
const repostSchema = new mongoose_1.Schema({
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const Repost = (0, mongoose_1.model)("Repost", repostSchema);
exports.Repost = Repost;
