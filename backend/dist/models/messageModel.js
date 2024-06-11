"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const participantSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { _id: false });
const messageSchema = new mongoose_1.Schema({
    conversationId: {
        type: String,
        requried: true,
    },
    media: {
        type: String,
        required: false,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: false,
    },
    readBy: [participantSchema],
    viewableBy: [participantSchema],
}, { timestamps: true });
const Message = (0, mongoose_1.model)("Message", messageSchema);
exports.Message = Message;
