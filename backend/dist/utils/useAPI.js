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
exports.useAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const config = {
    headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "2b04dc0863c0897b2360fb19617d642f",
    },
};
const useAPI = (method_1, url_1, ...args_1) => __awaiter(void 0, [method_1, url_1, ...args_1], void 0, function* (method, url, data = null, retryCount = 3) {
    let attempts = 0;
    while (attempts < retryCount) {
        try {
            let response;
            const fullUrl = `https://v3.football.api-sports.io${url}`;
            switch (method.toLowerCase()) {
                case "get":
                    response = yield axios_1.default.get(fullUrl, config);
                    break;
                case "post":
                    response = yield axios_1.default.post(fullUrl, data, config);
                    break;
                case "put":
                    response = yield axios_1.default.put(fullUrl, data, config);
                    break;
                case "delete":
                    response = yield axios_1.default.delete(fullUrl, config);
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }
            return response.data;
        }
        catch (error) {
            attempts++;
            console.error("Error fetching data: ", error.message);
            if (attempts >= retryCount) {
                console.error("Max retries reached. Failing...");
                throw error;
            }
            // Implement a backoff strategy or delay if desired
            yield new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
        }
    }
});
exports.useAPI = useAPI;
