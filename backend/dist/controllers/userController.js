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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const userModel_1 = require("../models/userModel");
const notificationModel_1 = require("../models/notificationModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = require("cloudinary");
const env_1 = require("../config/env");
cloudinary_1.v2.config({
    cloud_name: env_1.config.cloudinaryCloudName,
    api_key: env_1.config.cloudinaryApiKey,
    api_secret: env_1.config.cloudinaryApiSecret,
});
exports.userController = {
    getUserByUsername: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = req.params;
        try {
            const user = yield userModel_1.User.findOne({ username });
            return res.status(200).send(user);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    followUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { currentUserId, targetUserId } = req.body.data;
        try {
            yield userModel_1.User.findByIdAndUpdate(currentUserId, {
                $addToSet: { following: targetUserId },
                $inc: { followingCount: 1 },
            });
            yield userModel_1.User.findByIdAndUpdate(targetUserId, {
                $addToSet: { followers: currentUserId },
                $inc: { followersCount: 1 },
            });
            yield notificationModel_1.Notification.create({
                type: "follow",
                from: currentUserId,
                to: targetUserId,
            });
            return res.status(200).send(true);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    unfollowUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { currentUserId, targetUserId } = req.body.data;
        try {
            yield userModel_1.User.findByIdAndUpdate(currentUserId, {
                $pull: { following: targetUserId },
                $inc: { followingCount: -1 },
            });
            yield userModel_1.User.findByIdAndUpdate(targetUserId, {
                $pull: { followers: currentUserId },
                $inc: { followersCount: -1 },
            });
            return res.status(200).send(false);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    checkFollowing: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { currentUserId, targetUserId } = req.body.data;
            if (!currentUserId || !targetUserId) {
                return res.status(400).json({ message: "Missing User ID(s)." });
            }
            const user = yield userModel_1.User.findById(currentUserId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const isFollowing = user.following.some((id) => id.toString() === targetUserId);
            return res.status(200).send(isFollowing);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    searchUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const query = req.query.query;
        try {
            const users = yield userModel_1.User.find({
                $or: [
                    { username: { $regex: query, $options: "i" } },
                    { displayName: { $regex: query, $options: "i" } },
                ],
            });
            if (!users) {
                return res.status(400).send("No users");
            }
            return res.status(200).send(users);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    editUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const { data, type } = req.body.data;
            if (!data) {
                return res.status(400).json({ message: "Missing data" });
            }
            if (type === "username") {
                const user = yield userModel_1.User.findByIdAndUpdate(id, {
                    username: data,
                }, { new: true });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const updatedJwt = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    displayName: user.displayName,
                    bio: user.bio,
                    avatar: user.avatar,
                    team: user.team,
                }, process.env.JWT_SECRET);
                req.session = {
                    jwt: updatedJwt,
                };
                return res.status(200).send(user);
            }
            if (type === "email") {
                const user = yield userModel_1.User.findByIdAndUpdate(id, {
                    email: data,
                }, { new: true });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const updatedJwt = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    displayName: user.displayName,
                    bio: user.bio,
                    avatar: user.avatar,
                    team: user.team,
                }, process.env.JWT_SECRET);
                req.session = {
                    jwt: updatedJwt,
                };
                return res.status(200).send(user);
            }
            if (type === "profile") {
                let updateData = {
                    displayName: data.displayName,
                    bio: data.bio,
                };
                if (data.avatar) {
                    const result = yield cloudinary_1.v2.uploader.upload(data.avatar);
                    const imageUrl = result.secure_url;
                    updateData.avatar = imageUrl;
                }
                const user = yield userModel_1.User.findByIdAndUpdate(id, updateData, { new: true });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const updatedJwt = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    bio: user.bio,
                    username: user.username,
                    displayName: user.displayName,
                    avatar: user.avatar,
                    team: user.team,
                }, process.env.JWT_SECRET);
                req.session = {
                    jwt: updatedJwt,
                };
                return res.status(200).send(user);
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
    suggestUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const currentUser = yield userModel_1.User.findById(id);
            const suggestions = yield userModel_1.User.aggregate([
                {
                    $match: {
                        _id: { $ne: id },
                        "team.team": currentUser === null || currentUser === void 0 ? void 0 : currentUser.team.team,
                    },
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "_id",
                        foreignField: "user",
                        as: "posts",
                    },
                },
                {
                    $addFields: {
                        postCount: { $size: "$posts" },
                        likeCount: { $sum: "$posts.likeCount" },
                    },
                },
                {
                    $project: {
                        username: 1,
                        displayName: 1,
                        avatar: 1,
                        bio: 1,
                        score: {
                            $add: [
                                {
                                    $multiply: [
                                        {
                                            $cond: [
                                                { $eq: ["$team.team", currentUser === null || currentUser === void 0 ? void 0 : currentUser.team.team] },
                                                1,
                                                0,
                                            ],
                                        },
                                        10,
                                    ],
                                },
                                { $multiply: ["$postCount", 5] },
                                { $multiply: ["$likeCount", 2] },
                            ],
                        },
                    },
                },
                { $sort: { score: -1 } },
                { $limit: 5 },
            ]);
            return res.status(200).send(suggestions);
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
