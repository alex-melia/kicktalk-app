"use strict";
// import { createClient } from "redis"
// import { config } from "../config/env"
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
exports.connectToRedis = void 0;
// const client = createClient({
//   url: config.redisUrl,
//   password: config.redisPassword,
// })
// client.on("error", (err) => console.log("Redis Client Error", err))
// export const connectToRedis = async () => {
//   try {
//     await client.connect()
//     console.log("Connected to Redis!")
//   } catch (err) {
//     console.error("Redis connection error:", err)
//     process.exit(1)
//   }
// }
// export default client
// const client = createClient()
const redis_1 = require("redis");
const env_1 = require("../config/env");
const client = (0, redis_1.createClient)({
    password: env_1.config.redisPassword,
    socket: {
        host: env_1.config.redisUrl,
        port: Number(env_1.config.redisPort),
    },
});
const connectToRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Connected to Redis!");
    }
    catch (err) {
        console.error("Redis connection error:", err);
        process.exit(1);
    }
});
exports.connectToRedis = connectToRedis;
exports.default = client;
