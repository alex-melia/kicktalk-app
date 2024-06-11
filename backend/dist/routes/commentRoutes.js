"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
exports.commentRoutes = router;
router.get("/fixture/:id", commentController_1.commentController.getCommentsByFixture);
router.get("/player/:id", commentController_1.commentController.getCommentsByPlayer);
router.post("/", commentController_1.commentController.create);
router.put("/upvote/:id", commentController_1.commentController.upvoteComment);
router.put("/downvote/:id", commentController_1.commentController.downvoteComment);
