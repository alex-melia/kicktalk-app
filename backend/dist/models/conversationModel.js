"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose_1 = require("mongoose");
const participantSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    active: { type: Boolean, default: true },
}, { _id: false });
const conversationSchema = new mongoose_1.Schema({
    participants: [participantSchema],
    isRequested: {
        type: Boolean,
        required: false,
    },
    requestedBy: {
        type: String,
        required: false,
    },
}, { timestamps: true });
const Conversation = (0, mongoose_1.model)("Conversation", conversationSchema);
exports.Conversation = Conversation;
