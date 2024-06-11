import express from "express"
import { conversationController } from "../controllers/conversationController"

const router = express.Router()

router.post("/", conversationController.create)

router.get("/:id", conversationController.getConversation)
router.get("/byuser/:id", conversationController.getConversationsByUser)
router.get("/byquery/:id", conversationController.getConversationsByQuery)

router.put("/leave/:id", conversationController.leaveConversation)
router.put("/accept/:id", conversationController.acceptConversation)
router.put("/decline/:id", conversationController.declineConversation)

export { router as conversationRoutes }
