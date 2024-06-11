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
exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!env_1.config.dbUri) {
            throw new Error("Database URI is not defined");
        }
        yield mongoose_1.default.connect(env_1.config.dbUri);
        console.log("Connected to database!");
        console.log(process.env.JWT_SECRET);
    }
    catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
});
exports.connectToDB = connectToDB;
//
