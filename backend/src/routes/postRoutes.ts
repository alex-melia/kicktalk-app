import express from "express"
import { postController } from "../controllers/postController"
import { currentUser } from "../middlewares/currentUser"

const router = express.Router()

router.get("/", currentUser, postController.getPosts)
router.get("/top-posts", currentUser, postController.getTopPosts)
router.get("/most-replied", currentUser, postController.getMostReplied)
router.post("/fixture/:id", currentUser, postController.getFixturePosts)
router.get("/:postId", currentUser, postController.getPostById)
// router.get("/byuser/:username", currentUser, postController.getUserPosts)
router.get("/byuser/:username", currentUser, postController.getUserPosts)

router.post("/create", postController.create)
router.post("/like/:postId/:currentUserId", postController.likePost)
router.post("/unlike/:postId/:userId", postController.unlikePost)

router.post("/repost/:postId/:currentUserId", postController.repostPost)
router.post("/unrepost/:postId/:userId", postController.unrepostPost)

router.put("/:id", postController.update)

export { router as postRoutes }
