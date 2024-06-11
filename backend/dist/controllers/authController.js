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
exports.authController = void 0;
const userModel_1 = require("../models/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = require("cloudinary");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
cloudinary_1.v2.config({
    cloud_name: env_1.config.cloudinaryCloudName,
    api_key: env_1.config.cloudinaryApiKey,
    api_secret: env_1.config.cloudinaryApiSecret,
});
exports.authController = {
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = req.body.data;
        try {
            if (!username || !password) {
                return res
                    .status(401)
                    .send({ error: "Username and/or password are null" });
            }
            const user = yield userModel_1.User.findOne({ username }).select("+password");
            if (!user) {
                return res.status(401).send({ error: "Incorrect username or password" });
            }
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send({ error: "Incorrect username or password" });
            }
            const userJwt = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                bio: user.bio,
                username: user.username,
                displayName: user.displayName,
                avatar: user.avatar,
                team: user.team,
            }, `${process.env.JWT_SECRET}`);
            req.session = {
                jwt: userJwt,
            };
            return res.status(200).send(req.currentUser);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    logout: (req, res) => {
        req.session = null;
        return res.status(200).send({});
    },
    signup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, username, password, avatar, team } = req.body.data;
        try {
            // Default user image
            let imageUrl = "https://res.cloudinary.com/dmztnqpzb/image/upload/v1715602450/default-user.png";
            if (avatar) {
                const result = yield cloudinary_1.v2.uploader.upload(avatar);
                imageUrl = result.secure_url;
            }
            const newUser = yield userModel_1.User.create({
                email: email,
                username: username,
                displayName: username,
                password: password,
                avatar: imageUrl,
                team: team,
            });
            yield newUser.save();
            const userJwt = jsonwebtoken_1.default.sign({
                id: newUser.id,
            }, "12345");
            req.session = {
                jwt: userJwt,
            };
            return res.status(201).send(newUser);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    changePassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { currentPassword, newPassword, confirmPassword } = req.body.data;
        const { id } = req.params;
        try {
            const user = yield userModel_1.User.findById(id);
            if (!user) {
                return res.status(400).send("No such user exists!");
            }
            if (typeof (user === null || user === void 0 ? void 0 : user.password) === "undefined") {
                return res.status(400).send("User password not set.");
            }
            const isMatch = yield bcryptjs_1.default.compare(currentPassword, user === null || user === void 0 ? void 0 : user.password);
            if (!isMatch) {
                return res.status(400).send("Incorrect password!");
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).send("Passwords do not match!");
            }
            const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 12);
            yield user.updateOne({
                password: hashedNewPassword,
            });
            return res.status(200).send("Successfully changed password");
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    currentuser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        return res.send({ currentUser: req.currentUser || null });
    }),
};
