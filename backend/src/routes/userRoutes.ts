import express from "express"
import { userController } from "../controllers/userController"

const router = express.Router()

router.get("/search", userController.searchUsers)
router.get("/:username", userController.getUserByUsername)
router.get("/suggestions/:id", userController.suggestUsers)

router.post("/follow", userController.followUser)
router.post("/unfollow", userController.unfollowUser)
router.post("/check-following", userController.checkFollowing)

router.put("/:id", userController.editUser)

export { router as userRoutes }
