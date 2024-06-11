"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const currentUser_1 = require("../middlewares/currentUser");
const router = express_1.default.Router();
exports.postRoutes = router;
router.get("/", currentUser_1.currentUser, postController_1.postController.getPosts);
router.get("/top-posts", currentUser_1.currentUser, postController_1.postController.getTopPosts);
router.get("/most-replied", currentUser_1.currentUser, postController_1.postController.getMostReplied);
router.post("/fixture/:id", currentUser_1.currentUser, postController_1.postController.getFixturePosts);
router.get("/:postId", currentUser_1.currentUser, postController_1.postController.getPostById);
// router.get("/byuser/:username", currentUser, postController.getUserPosts)
router.get("/byuser/:username", currentUser_1.currentUser, postController_1.postController.getUserPosts);
router.post("/create", postController_1.postController.create);
router.post("/like/:postId/:currentUserId", postController_1.postController.likePost);
router.post("/unlike/:postId/:userId", postController_1.postController.unlikePost);
router.post("/repost/:postId/:currentUserId", postController_1.postController.repostPost);
router.post("/unrepost/:postId/:userId", postController_1.postController.unrepostPost);
router.put("/:id", postController_1.postController.update);
