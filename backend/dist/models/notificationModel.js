"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        required: false,
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: false,
    },
    read: {
        type: Boolean,
        required: true,
        default: false,
    },
    from: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const Notification = (0, mongoose_1.model)("Notification", notificationSchema);
exports.Notification = Notification;
