"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controllers/messageController");
const router = express_1.default.Router();
exports.messageRoutes = router;
router.get("/:id", messageController_1.messageController.getMessages);
router.get("/count/:id", messageController_1.messageController.countMessages);
router.post("/", messageController_1.messageController.create);
router.post("/read/:id", messageController_1.messageController.readMessages);
