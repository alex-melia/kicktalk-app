"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = void 0;
const cloudinary_1 = require("cloudinary");
const messageModel_1 = require("../models/messageModel");
const conversationModel_1 = require("../models/conversationModel");
const env_1 = require("../config/env");
cloudinary_1.v2.config({
    cloud_name: env_1.config.cloudinaryCloudName,
    api_key: env_1.config.cloudinaryApiKey,
    api_secret: env_1.config.cloudinaryApiSecret,
});
exports.messageController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { conversationId, text, media, senderId, targetUserId } = req.body.data;
        try {
            let imageUrl = "";
            if (media) {
                try {
                    const result = yield cloudinary_1.v2.uploader.upload(media);
                    imageUrl = result.secure_url;
                }
                catch (error) {
                    console.error("Failed to upload image to Cloudinary", error);
                }
            }
            const newMessage = yield messageModel_1.Message.create({
                conversationId: conversationId,
                text: text,
                media: imageUrl,
                sender: senderId,
                readBy: [{ user: senderId }],
                viewableBy: [{ user: senderId }, { user: targetUserId }],
            });
            yield newMessage.save();
            yield newMessage.populate("sender", "username displayName avatar");
            const conversation = yield conversationModel_1.Conversation.findById(conversationId);
            if (conversation && conversation.isRequested === false) {
                conversation.isRequested = true;
                conversation.requestedBy = senderId;
                yield conversation.save();
            }
            return res.status(201).send(newMessage);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const messages = yield messageModel_1.Message.find({
                conversationId: id,
            })
                .populate("sender", "username displayName avatar")
                .exec();
            return res.status(200).send(messages);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    readMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { conversationId } = req.body.data;
        try {
            const messages = yield messageModel_1.Message.updateMany({ conversationId: conversationId, "readBy.user": { $ne: id } }, { $addToSet: { readBy: { user: id } } });
            return res.status(200).send(messages);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    countMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const messagesCount = yield messageModel_1.Message.countDocuments({
                "readBy.user": { $ne: id },
                "viewableBy.user": { $eq: id },
            });
            return res.status(200).send(messagesCount.toString());
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
};
