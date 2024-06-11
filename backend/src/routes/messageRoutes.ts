import express from "express"
import { messageController } from "../controllers/messageController"

const router = express.Router()

router.get("/:id", messageController.getMessages)
router.get("/count/:id", messageController.countMessages)

router.post("/", messageController.create)
router.post("/read/:id", messageController.readMessages)

export { router as messageRoutes }
