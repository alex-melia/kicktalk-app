"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const router = express_1.default.Router();
exports.notificationRoutes = router;
router.get("/:id", notificationController_1.notificationController.getNotifications);
router.get("/count/:id", notificationController_1.notificationController.countNotifications);
router.post("/read/:id", notificationController_1.notificationController.readNotifications);
