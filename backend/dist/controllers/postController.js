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
exports.postController = void 0;
const postModel_1 = require("../models/postModel");
const likeModel_1 = require("../models/likeModel");
const cloudinary_1 = require("cloudinary");
const notificationModel_1 = require("../models/notificationModel");
const userModel_1 = require("../models/userModel");
const repostModel_1 = require("../models/repostModel");
const env_1 = require("../config/env");
cloudinary_1.v2.config({
    cloud_name: env_1.config.cloudinaryCloudName,
    api_key: env_1.config.cloudinaryApiKey,
    api_secret: env_1.config.cloudinaryApiSecret,
});
exports.postController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { postType, content, media, fixture, user, replyingTo } = req.body.data;
        try {
            let imageUrls = [];
            if (media && Array.isArray(media)) {
                for (const singleMedia of media) {
                    try {
                        const result = yield cloudinary_1.v2.uploader.upload(singleMedia);
                        imageUrls.push(result.secure_url);
                    }
                    catch (error) {
                        console.error("Failed to upload image to Cloudinary", error);
                    }
                }
            }
            if (postType === "post") {
                const newPost = yield postModel_1.Post.create({
                    postType: postType,
                    content: content,
                    media: imageUrls,
                    fixture: fixture,
                    user: user,
                });
                yield newPost.populate("user");
                yield newPost.save();
                return res.status(201).send(newPost);
            }
            if (postType === "reply") {
                const newPost = yield postModel_1.Post.create({
                    postType: postType,
                    replyingTo: replyingTo,
                    content: content,
                    media: media,
                    user: user,
                });
                yield notificationModel_1.Notification.create({
                    type: "reply",
                    post: newPost._id,
                    from: user,
                    to: replyingTo,
                });
                yield postModel_1.Post.findByIdAndUpdate(replyingTo, {
                    $addToSet: { repliedBy: user },
                }, { new: true });
                yield newPost.save();
                yield newPost.populate("user", "username displayName avatar");
                return res.status(201).send(newPost);
            }
            if (postType === "repost") {
                const newPost = yield postModel_1.Post.create({
                    postType: postType,
                    content: content,
                    user: user,
                });
                yield newPost.save();
                return res.status(201).send(newPost);
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
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { action, contentType, otherUserId, currentUserId } = req.body.data;
        try {
            if (action === "like") {
                const post = yield postModel_1.Post.findById(id);
                if (post === null || post === void 0 ? void 0 : post.likedBy.includes(currentUserId)) {
                    yield postModel_1.Post.findByIdAndUpdate(id, {
                        $pull: { likedBy: currentUserId },
                    });
                    yield likeModel_1.Like.findOneAndDelete({
                        postId: id,
                        userId: currentUserId,
                    });
                }
                else {
                    yield postModel_1.Post.findByIdAndUpdate(id, {
                        $addToSet: { likedBy: currentUserId },
                    }, { new: true });
                    yield likeModel_1.Like.create({
                        postId: id,
                        userId: currentUserId,
                    });
                    yield notificationModel_1.Notification.create({
                        type: "like",
                        contentType: contentType,
                        from: currentUserId,
                        to: otherUserId,
                    });
                }
                const updatedPost = yield postModel_1.Post.findById(id).populate("user", "username displayName avatar");
                return res.status(200).send(updatedPost);
            }
            else if (action === "repost") {
                const post = yield postModel_1.Post.findById(id);
                if (post === null || post === void 0 ? void 0 : post.repostedBy.includes(currentUserId)) {
                    yield postModel_1.Post.findByIdAndUpdate(id, {
                        $pull: { repostedBy: currentUserId },
                    });
                    yield repostModel_1.Repost.findOneAndDelete({
                        post: id,
                        user: currentUserId,
                    });
                }
                else {
                    yield postModel_1.Post.findByIdAndUpdate(id, {
                        $addToSet: { repostedBy: currentUserId },
                    }, { new: true });
                    yield repostModel_1.Repost.create({
                        type: "repost",
                        contentType: contentType,
                        post: id,
                        user: currentUserId,
                    });
                }
                const updatedPost = yield postModel_1.Post.findById(id).populate("user", "username displayName avatar");
                return res.status(200).send(updatedPost);
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
    getPosts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;
        const type = req.query.type;
        const userId = (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id;
        try {
            if (type === "all") {
                const posts = yield postModel_1.Post.find({
                    postType: "post",
                })
                    .populate("user")
                    .populate({
                    path: "replyingTo",
                    populate: { path: "user" },
                })
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .skip(skipIndex);
                return res.status(200).send(posts);
            }
            else if (type == "following") {
                const currentUser = yield userModel_1.User.findById(userId).select("following");
                if (!currentUser) {
                    return res.status(400).send("No current user");
                }
                const followingIds = currentUser.following.map((user) => user._id);
                const posts = yield postModel_1.Post.find({
                    postType: "post",
                    user: { $in: followingIds },
                })
                    .populate("user")
                    .populate({
                    path: "replyingTo",
                    populate: { path: "user" },
                })
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .skip(skipIndex);
                return res.status(200).send(posts);
            }
            else {
                return res.status(404).send("Not found");
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
    getPostById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { postId } = req.params;
        const userId = (_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.id;
        try {
            const post = yield postModel_1.Post.findById(postId)
                .populate("user")
                .populate({
                path: "replyingTo",
                populate: { path: "user" },
            });
            if (!post) {
                return res.status(404).send({ message: "Post not found" });
            }
            const replies = yield postModel_1.Post.find({
                postType: "reply",
                replyingTo: postId,
            })
                .populate("user")
                .populate({
                path: "replyingTo",
                populate: { path: "user" },
            });
            const isLiked = (yield likeModel_1.Like.findOne({ postId: postId, userId: userId })) != null;
            const postWithLike = {
                post,
                replies,
                isLiked,
            };
            return res.status(200).send(postWithLike);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getUserPosts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username } = req.params;
            const { postType } = req.query;
            const user = yield userModel_1.User.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (postType === "media") {
                const mediaPosts = yield postModel_1.Post.find({
                    user: user._id,
                    media: { $exists: true, $ne: [] },
                })
                    .populate("user")
                    .populate({
                    path: "replyingTo",
                    populate: { path: "user" },
                })
                    .sort({ createdAt: -1 });
                if (mediaPosts && mediaPosts.length > 0) {
                    return res.status(200).send(mediaPosts);
                }
                else {
                    return res.status(200).send(null);
                }
            }
            if (postType === "likes") {
                const userLikes = yield postModel_1.Post.find({
                    likedBy: { $in: [user._id] },
                })
                    .populate("user")
                    .populate({
                    path: "replyingTo",
                    populate: { path: "user" },
                })
                    .sort({ createdAt: -1 });
                if (userLikes && userLikes.length > 0) {
                    return res.status(200).send(userLikes);
                }
                else {
                    return res.status(200).send(null);
                }
            }
            if (postType === "reply") {
                const userReplies = yield postModel_1.Post.find({
                    user: user._id,
                    postType: "reply",
                })
                    .populate("user")
                    .populate({
                    path: "replyingTo",
                    populate: { path: "user" },
                })
                    .sort({ createdAt: -1 });
                if (userReplies && userReplies.length > 0) {
                    return res.status(200).send(userReplies);
                }
                else {
                    return res.status(200).send(null);
                }
            }
            const userPosts = yield postModel_1.Post.find({
                user: user._id,
                // ...(postType ? { postType } : {}),
                postType: "post",
            })
                .populate("user")
                .populate({
                path: "replyingTo",
                populate: { path: "user" },
            })
                .sort({ createdAt: -1 });
            return res.status(200).send(userPosts);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getTopPosts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const posts = yield postModel_1.Post.find({
                postType: "post",
                createdAt: {
                    $gte: oneDayAgo,
                    $lte: now,
                },
            })
                .populate("user")
                .populate({
                path: "replyingTo",
                populate: { path: "user" },
            })
                .sort({ likedBy: -1 });
            if (posts) {
                return res.status(200).send(posts);
            }
            else {
                return res.status(404).send("No posts found");
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
    getMostReplied: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const posts = yield postModel_1.Post.find({
                postType: "post",
                createdAt: {
                    $gte: oneDayAgo,
                    $lte: now,
                },
            })
                .populate("user")
                .populate({
                path: "replyingTo",
                populate: { path: "user" },
            })
                .sort({ repliedBy: -1 });
            if (posts) {
                return res.status(200).send(posts);
            }
            else {
                return res.status(404).send("No posts found");
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
    getFixturePosts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { type } = req.body.data;
            if (type === "top-posts") {
                const posts = yield postModel_1.Post.find({ "fixture.id": Number(id) })
                    .populate("user")
                    .populate({
                    path: "replyingTo",
                    populate: { path: "user" },
                });
                posts.sort((a, b) => b.likeCount - a.likeCount);
                return res.status(200).send(posts);
            }
            else {
                const posts = yield postModel_1.Post.find({ "fixture.id": Number(id) })
                    .populate("user")
                    .populate({
                    path: "replyingTo",
                    populate: { path: "user" },
                })
                    .sort({ createdAt: -1 });
                return res.status(200).send(posts);
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
    likePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId } = req.params;
        const { currentUserId } = req.body.data;
        try {
            const post = yield postModel_1.Post.findById(postId);
            if (post === null || post === void 0 ? void 0 : post.likedBy.includes(currentUserId)) {
                yield postModel_1.Post.findByIdAndUpdate(postId, {
                    $pull: { likedBy: currentUserId },
                });
                yield likeModel_1.Like.findOneAndDelete({
                    postId: postId,
                    userId: currentUserId,
                });
            }
            else {
                yield postModel_1.Post.findByIdAndUpdate(postId, {
                    $addToSet: { likedBy: currentUserId },
                }, { new: true });
                yield likeModel_1.Like.create({
                    postId: postId,
                    userId: currentUserId,
                });
            }
            const updatedPost = yield postModel_1.Post.findById(postId).populate("user", "username displayName avatar");
            return res.status(200).send(updatedPost);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    unlikePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId, userId } = req.params;
        const { currentUserId } = req.body.data;
        try {
            const post = yield postModel_1.Post.findById(postId);
            if (post === null || post === void 0 ? void 0 : post.likedBy.includes(currentUserId)) {
                yield postModel_1.Post.findByIdAndUpdate(postId, {
                    $pull: { likedBy: currentUserId },
                });
            }
            else {
                yield postModel_1.Post.findByIdAndUpdate(postId, {
                    $addToSet: { likedBy: currentUserId },
                }, { new: true });
            }
            const updatedPost = yield postModel_1.Post.findById(postId).populate("user", "username displayName avatar");
            return res.status(200).send(updatedPost);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    repostPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId, currentUserId } = req.params;
        const { otherUserId } = req.body.data;
        try {
            const newRepost = yield repostModel_1.Repost.create({
                post: postId,
                user: currentUserId,
            });
            const post = yield postModel_1.Post.findById(postId);
            const newNotification = yield notificationModel_1.Notification.create({
                type: "repost",
                contentType: post === null || post === void 0 ? void 0 : post.postType,
                from: currentUserId,
                to: otherUserId,
            });
            return res.status(200).send(newRepost);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    unrepostPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { postId, userId } = req.params;
        try {
            const removeRepost = yield repostModel_1.Repost.deleteOne({
                postId: postId,
                userId: userId,
            });
            return res.status(200).send(removeRepost);
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
