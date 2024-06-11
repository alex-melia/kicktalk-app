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
exports.notificationController = void 0;
const notificationModel_1 = require("../models/notificationModel");
exports.notificationController = {
    getNotifications: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const notifications = yield notificationModel_1.Notification.find({
                from: { $ne: id },
                to: id,
            })
                .populate("from", "username displayName avatar")
                .populate("post", "content user likeCount replyCount repostCount createdAt")
                .sort({ createdAt: -1 })
                .exec();
            return res.status(200).send(notifications);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    countNotifications: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const notificationsCount = yield notificationModel_1.Notification.countDocuments({
                from: { $ne: id },
                to: id,
                read: false,
            });
            return res.status(200).send(notificationsCount.toString());
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    readNotifications: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const notifications = yield notificationModel_1.Notification.updateMany({ to: id, read: false }, { $set: { read: true } });
            return res.status(200).send(notifications);
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
