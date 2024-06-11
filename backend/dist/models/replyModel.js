"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reply = void 0;
const mongoose_1 = require("mongoose");
const replySchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    replyId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Reply = (0, mongoose_1.model)("Reply", replySchema);
exports.Reply = Reply;
