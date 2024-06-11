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
const app_1 = require("./app");
const env_1 = require("./config/env");
const socketController_1 = require("./controllers/socketController");
const db_1 = require("./loaders/db");
const redis_1 = require("./loaders/redis");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const scheduler_1 = require("./jobs/scheduler");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config.env" });
const server = http_1.default.createServer(app_1.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: env_1.config.corsOrigin,
        methods: ["GET", "POST"],
        credentials: true,
    },
});
(0, socketController_1.socketController)(io);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.connectToDB)();
    yield (0, redis_1.connectToRedis)();
    (0, scheduler_1.dailyJobs)();
    server.listen(env_1.config.socketPort, () => {
        console.log(`Server and Socket.IO listening on port ${env_1.config.socketPort}`);
    });
    app_1.app.listen(env_1.config.port, () => {
        console.log(`App listening on port ${env_1.config.port}`);
    });
});
startServer();
