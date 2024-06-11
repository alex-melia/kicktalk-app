"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
exports.userRoutes = router;
router.get("/search", userController_1.userController.searchUsers);
router.get("/:username", userController_1.userController.getUserByUsername);
router.get("/suggestions/:id", userController_1.userController.suggestUsers);
router.post("/follow", userController_1.userController.followUser);
router.post("/unfollow", userController_1.userController.unfollowUser);
router.post("/check-following", userController_1.userController.checkFollowing);
router.put("/:id", userController_1.userController.editUser);
