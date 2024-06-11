"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const currentUser_1 = require("../middlewares/currentUser");
const requireAuth_1 = require("../middlewares/requireAuth");
const router = express_1.default.Router();
exports.authRoutes = router;
router.post("/login", authController_1.authController.login);
router.post("/logout", requireAuth_1.requireAuth, authController_1.authController.logout);
router.post("/signup", authController_1.authController.signup);
router.put("/change-password/:id", requireAuth_1.requireAuth, authController_1.authController.changePassword);
router.get("/currentuser", currentUser_1.currentUser, authController_1.authController.currentuser);
