"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const conversationController_1 = require("../controllers/conversationController");
const router = express_1.default.Router();
exports.conversationRoutes = router;
router.post("/", conversationController_1.conversationController.create);
router.get("/:id", conversationController_1.conversationController.getConversation);
router.get("/byuser/:id", conversationController_1.conversationController.getConversationsByUser);
router.get("/byquery/:id", conversationController_1.conversationController.getConversationsByQuery);
router.put("/leave/:id", conversationController_1.conversationController.leaveConversation);
router.put("/accept/:id", conversationController_1.conversationController.acceptConversation);
router.put("/decline/:id", conversationController_1.conversationController.declineConversation);
