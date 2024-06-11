"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const socket_io_1 = require("socket.io");
exports.io = new socket_io_1.Server();
exports.io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("joinFixture", (fixtureId) => {
        socket.join(fixtureId);
        console.log(`A user joined fixture: ${fixtureId}`);
    });
    socket.on("joinPlayer", (playerId) => {
        socket.join(playerId);
        console.log(`A user joined player: ${playerId}`);
    });
    socket.on("newComment", ({ fixtureId, comment }) => {
        exports.io.to(fixtureId).emit("commentReceived", comment);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
