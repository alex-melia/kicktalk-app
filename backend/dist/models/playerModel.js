"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const mongoose_1 = require("mongoose");
const playerSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: false,
    },
    nationality: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});
const Player = (0, mongoose_1.model)("Player", playerSchema);
exports.Player = Player;
