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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// import morgan from "morgan"
const env_1 = require("./config/env");
// Routes
const authRoutes_1 = require("./routes/authRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const postRoutes_1 = require("./routes/postRoutes");
const dataRoutes_1 = require("./routes/dataRoutes");
const conversationRoutes_1 = require("./routes/conversationRoutes");
const messageRoutes_1 = require("./routes/messageRoutes");
const notificationRoutes_1 = require("./routes/notificationRoutes");
const commentRoutes_1 = require("./routes/commentRoutes");
const currentUser_1 = require("./middlewares/currentUser");
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
exports.app = app;
const isDev = process.env.NODE_ENV === "dev";
// Middlewares
app.set("trust proxy", true);
app.use((0, body_parser_1.json)({ limit: "50mb" }));
app.use(
// cookieSession({
//   signed: false,
//   secure: true,
//   sameSite: "none",
//   maxAge: 24 * 60 * 60 * 1000,
// })
(0, cookie_session_1.default)({
    signed: false,
    secure: !isDev,
    sameSite: isDev ? "lax" : "none",
    maxAge: 24 * 60 * 60 * 1000,
}));
app.use((0, cors_1.default)({ origin: env_1.config.corsOrigin, credentials: true }));
app.use((0, helmet_1.default)());
// app.use(morgan("combined"))
app.use(currentUser_1.currentUser);
app.use("/api/auth", authRoutes_1.authRoutes);
app.use("/api/users", userRoutes_1.userRoutes);
app.use("/api/posts", postRoutes_1.postRoutes);
app.use("/api/data", dataRoutes_1.dataRoutes);
app.use("/api/comments", commentRoutes_1.commentRoutes);
app.use("/api/conversations", conversationRoutes_1.conversationRoutes);
app.use("/api/messages", messageRoutes_1.messageRoutes);
app.use("/api/notifications", notificationRoutes_1.notificationRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to the API");
});
app.get("/favicon.ico", (req, res) => {
    return res.status(204).send(null);
});
app.get("/favicon.png", (req, res) => {
    return res.status(204).send(null);
});
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`)
//   next()
// })
app.all("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // throw new NotFoundError()
    return res.status(404).send("Route not found");
}));
app.use(errorHandler_1.errorHandler);
