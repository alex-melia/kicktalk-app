import express from "express"
import { notificationController } from "../controllers/notificationController"

const router = express.Router()

router.get("/:id", notificationController.getNotifications)
router.get("/count/:id", notificationController.countNotifications)
router.post("/read/:id", notificationController.readNotifications)

export { router as notificationRoutes }
