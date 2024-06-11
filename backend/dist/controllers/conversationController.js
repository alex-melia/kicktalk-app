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
exports.conversationController = void 0;
const conversationModel_1 = require("../models/conversationModel");
const messageModel_1 = require("../models/messageModel");
exports.conversationController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { currentUserId, targetUserId } = req.body.data;
        try {
            const existingConversation = yield conversationModel_1.Conversation.findOne({
                "participants.user": {
                    $all: [currentUserId, targetUserId],
                },
            });
            if (existingConversation) {
                yield conversationModel_1.Conversation.updateOne({ _id: existingConversation._id, "participants.user": currentUserId }, { $set: { "participants.$.active": true } });
                yield conversationModel_1.Conversation.updateOne({ _id: existingConversation._id, "participants.user": targetUserId }, { $set: { "participants.$.active": true } });
                return res.status(200).send(existingConversation === null || existingConversation === void 0 ? void 0 : existingConversation._id);
            }
            else {
                const newConversation = yield conversationModel_1.Conversation.create({
                    participants: [
                        { user: currentUserId, active: true },
                        { user: targetUserId, active: false },
                    ],
                    isRequested: true,
                    requestedBy: currentUserId,
                });
                yield newConversation.save();
                return res.status(201).send(newConversation._id);
            }
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getConversation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const conversation = yield conversationModel_1.Conversation.findById(id)
                .populate("participants.user", "username displayName avatar bio followersCount")
                .exec();
            return res.status(200).send(conversation);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getConversationsByUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const rconversations = yield conversationModel_1.Conversation.find({
                participants: {
                    $elemMatch: {
                        user: id,
                        $or: [{ active: false }],
                    },
                },
                isRequested: true,
            })
                .populate("participants.user", "username displayName avatar")
                .exec();
            const conversations = yield conversationModel_1.Conversation.find({
                participants: {
                    $elemMatch: {
                        user: id,
                        $or: [{ active: true }],
                    },
                },
            })
                .populate("participants.user", "username displayName avatar")
                .exec();
            if (conversations || rconversations) {
                return res.status(200).send({ rconversations, conversations });
            }
            else {
                return res.status(404).send({ message: "Conversation not found" });
            }
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getConversationsByQuery: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const query = req.query.query;
        try {
            console.log(query);
            const rconversations = yield conversationModel_1.Conversation.find({
                participants: {
                    $elemMatch: {
                        "user.username": { $regex: query, $options: "i" },
                        $or: [{ active: false }],
                    },
                },
                isRequested: true,
            })
                .populate("participants.user", "username displayName avatar")
                .exec();
            const conversations = yield conversationModel_1.Conversation.find({
                participants: {
                    $elemMatch: {
                        "user.username": { $regex: query, $options: "i" },
                        $or: [{ active: true }],
                    },
                },
            })
                .populate("participants.user", "username displayName avatar")
                .exec();
            if (conversations || rconversations) {
                return res.status(200).send({ rconversations, conversations });
            }
            else {
                return res.status(404).send({ message: "Conversation not found" });
            }
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    acceptConversation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { currentUserId } = req.body.data;
        try {
            const conversation = yield conversationModel_1.Conversation.findByIdAndUpdate(id, {
                $set: {
                    "participants.$[elem].active": true,
                    isRequested: false,
                    requestedBy: false,
                },
            }, {
                new: true, // Return the modified document rather than the original
                arrayFilters: [{ "elem.user": currentUserId }], // Specify the filter condition for which array element to modify
            })
                .populate("participants.user", "username displayName avatar")
                .exec();
            return res.status(200).send(conversation);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    declineConversation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { currentUserId } = req.body.data;
        try {
            const conversation = yield conversationModel_1.Conversation.findByIdAndUpdate(id, {
                $set: {
                    "participants.$[elem].active": false,
                    isRequested: false,
                    requestedBy: null,
                },
            }, {
                new: true, // Return the modified document rather than the original
                arrayFilters: [{ "elem.user": currentUserId }], // Specify the filter condition for which array element to modify
            })
                .populate("participants.user", "username displayName avatar")
                .exec();
            yield messageModel_1.Message.updateMany({ conversationId: id }, {
                $pull: {
                    viewableBy: { user: currentUserId }, // Specify the condition to remove the user from viewableBy
                },
            });
            yield messageModel_1.Message.deleteMany({
                conversationId: id,
                viewableBy: { $size: 0 },
            });
            const areAllParticipantsInactive = conversation === null || conversation === void 0 ? void 0 : conversation.participants.every((participant) => !participant.active);
            if (areAllParticipantsInactive) {
                yield conversationModel_1.Conversation.findByIdAndDelete(id);
            }
            return res.status(200).send(conversation);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    leaveConversation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { currentUserId } = req.body.data;
        try {
            const conversation = yield conversationModel_1.Conversation.findByIdAndUpdate(id, {
                $set: {
                    "participants.$[elem].active": false,
                    isRequested: false,
                    requestedBy: null,
                },
            }, {
                new: true, // Return the modified document rather than the original
                arrayFilters: [{ "elem.user": currentUserId }], // Specify the filter condition for which array element to modify
            })
                .populate("participants.user", "username displayName avatar")
                .exec();
            yield messageModel_1.Message.updateMany({ conversationId: id }, {
                $pull: {
                    viewableBy: { user: currentUserId }, // Specify the condition to remove the user from viewableBy
                },
            });
            yield messageModel_1.Message.deleteMany({
                conversationId: id,
                viewableBy: { $size: 0 },
            });
            const areAllParticipantsInactive = conversation === null || conversation === void 0 ? void 0 : conversation.participants.every((participant) => !participant.active);
            if (areAllParticipantsInactive) {
                yield conversationModel_1.Conversation.findByIdAndDelete(id);
                return res.status(200).send(conversation);
            }
            if (conversation) {
                return res.status(200).send(conversation);
            }
            else {
                return res.status(404).send({ message: "Conversation not found" });
            }
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
