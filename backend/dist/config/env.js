"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config.env" });
const isDev = process.env.NODE_ENV === "dev";
exports.config = {
    dbUri: (_a = process.env.DATABASE) === null || _a === void 0 ? void 0 : _a.replace("<PASSWORD>", process.env.DATABASE_PASSWORD || ""),
    redisUrl: process.env.REDIS_URL,
    redisPassword: process.env.REDIS_PASSWORD,
    redisPort: process.env.REDIS_PORT,
    port: process.env.PORT || 5174,
    socketPort: process.env.SOCKET_PORT || 5173,
    corsOrigin: !isDev ? process.env.CORS_ORIGIN_URL : "http://localhost:5173",
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};
