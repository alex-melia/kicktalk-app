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
exports.commentController = void 0;
const commentModel_1 = require("../models/commentModel");
exports.commentController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { content, commentType, fixtureId, playerId, userId } = req.body.data;
        try {
            if (commentType === "fixture") {
                const newComment = yield commentModel_1.Comment.create({
                    content: content,
                    commentType: commentType,
                    fixtureId: fixtureId,
                    user: userId,
                });
                yield newComment.save();
                return res.status(201).send(newComment);
            }
            else if (commentType === "player") {
                const newComment = yield commentModel_1.Comment.create({
                    content: content,
                    commentType: commentType,
                    playerId: playerId,
                    user: userId,
                });
                yield newComment.save();
                return res.status(201).send(newComment);
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
    getCommentsByFixture: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const comments = yield commentModel_1.Comment.find({
                fixtureId: id,
            })
                .populate("user", "username displayName avatar")
                .sort({ voteCount: -1 });
            return res.status(200).send(comments);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getCommentsByPlayer: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { range } = req.query;
        try {
            let dateLimit = new Date();
            switch (range) {
                case "24h":
                    dateLimit.setDate(dateLimit.getDate() - 1);
                    break;
                case "1w":
                    dateLimit.setDate(dateLimit.getDate() - 7);
                    break;
                case "1m":
                    dateLimit.setMonth(dateLimit.getMonth() - 1);
                    break;
                case "1y":
                    dateLimit.setFullYear(dateLimit.getFullYear() - 1);
                    break;
                case "latest":
                    dateLimit = new Date();
                    break;
                case "all":
                    dateLimit = new Date(0);
                    break;
                default:
                    dateLimit = new Date(0);
                    break;
            }
            const comments = yield commentModel_1.Comment.find({
                playerId: id,
            }).populate("user", "username displayName avatar");
            if (range !== "latest") {
                comments.sort((a, b) => {
                    const voteCountA = a.upvotes.length - a.downvotes.length;
                    const voteCountB = b.upvotes.length - b.downvotes.length;
                    return voteCountB - voteCountA;
                });
            }
            return res.status(200).send(comments);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    upvoteComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { type, userId } = req.body.data;
        try {
            const comment = yield commentModel_1.Comment.findById(id);
            if (comment === null || comment === void 0 ? void 0 : comment.downvotes.includes(userId)) {
                yield commentModel_1.Comment.findByIdAndUpdate(id, {
                    $pull: { downvotes: userId },
                });
            }
            if (type === "add") {
                yield commentModel_1.Comment.findByIdAndUpdate(id, {
                    $addToSet: { upvotes: userId },
                }, { new: true });
            }
            else {
                yield commentModel_1.Comment.findByIdAndUpdate(id, {
                    $pull: { upvotes: userId },
                }, { new: true });
            }
            const updatedComment = yield commentModel_1.Comment.findById(id).populate("user", "username displayName avatar");
            return res.status(200).send(updatedComment);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    downvoteComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { type, userId } = req.body.data;
        try {
            const comment = yield commentModel_1.Comment.findById(id);
            if (comment === null || comment === void 0 ? void 0 : comment.upvotes.includes(userId)) {
                yield commentModel_1.Comment.findByIdAndUpdate(id, {
                    $pull: { upvotes: userId },
                });
            }
            if (type === "add") {
                yield commentModel_1.Comment.findByIdAndUpdate(id, {
                    $addToSet: { downvotes: userId },
                }, { new: true });
            }
            else {
                yield commentModel_1.Comment.findByIdAndUpdate(id, {
                    $pull: { downvotes: userId },
                }, { new: true });
            }
            const updatedComment = yield commentModel_1.Comment.findById(id).populate("user", "username displayName avatar");
            return res.status(200).send(updatedComment);
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
