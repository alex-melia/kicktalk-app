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
exports.socketController = void 0;
const commentModel_1 = require("../models/commentModel");
const socketController = (io) => {
    io.on("connection", (socket) => {
        socket.on("joinFixture", (fixtureId) => {
            socket.join(fixtureId);
            console.log(`${socket.id} joined fixture: ${fixtureId}`);
        });
        socket.on("leaveFixture", (fixtureId) => {
            socket.leave(fixtureId);
            console.log(`${socket.id} left fixture: ${fixtureId}`);
        });
        socket.on("joinConversation", (conversationId) => {
            socket.join(conversationId);
            console.log(`${socket.id} joined conversation: ${conversationId}`);
        });
        socket.on("leaveConversation", (conversationId) => {
            socket.leave(conversationId);
            console.log(`${socket.id} left conversation: ${conversationId}`);
        });
        socket.on("joinPlayer", (playerId) => {
            socket.join(playerId);
            console.log(`${socket.id} joined player: ${playerId}`);
        });
        socket.on("leavePlayer", (playerId) => {
            socket.leave(playerId);
            console.log(`${socket.id} left player: ${playerId}`);
        });
        socket.on("newComment", (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, comment }) {
            const nc = yield commentModel_1.Comment.findById(comment._id).populate("user", "username displayName avatar");
            io.to(id).emit("commentReceived", nc);
        }));
        socket.on("newMessage", (_b) => __awaiter(void 0, [_b], void 0, function* ({ id, message }) {
            socket.to(id).emit("messageReceived", message);
        }));
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};
exports.socketController = socketController;
