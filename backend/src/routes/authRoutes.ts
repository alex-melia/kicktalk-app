import express from "express"
import { authController } from "../controllers/authController"
import { currentUser } from "../middlewares/currentUser"
import { requireAuth } from "../middlewares/requireAuth"

const router = express.Router()

router.post("/login", authController.login)
router.post("/logout", requireAuth, authController.logout)
router.post("/signup", authController.signup)
router.put("/change-password/:id", requireAuth, authController.changePassword)
router.get("/currentuser", currentUser, authController.currentuser)

export { router as authRoutes }
