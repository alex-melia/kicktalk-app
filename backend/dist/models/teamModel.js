"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = require("mongoose");
const teamSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
});
const Team = (0, mongoose_1.model)("Team", teamSchema);
exports.Team = Team;
