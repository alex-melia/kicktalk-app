import express from "express"
import { commentController } from "../controllers/commentController"

const router = express.Router()

router.get("/fixture/:id", commentController.getCommentsByFixture)
router.get("/player/:id", commentController.getCommentsByPlayer)

router.post("/", commentController.create)

router.put("/upvote/:id", commentController.upvoteComment)
router.put("/downvote/:id", commentController.downvoteComment)

export { router as commentRoutes }
