import express from "express"
import cookieSession from "cookie-session"
import { json } from "body-parser"
import cors from "cors"
import helmet from "helmet"
// import morgan from "morgan"
import { config } from "./config/env"

// Routes
import { authRoutes } from "./routes/authRoutes"
import { userRoutes } from "./routes/userRoutes"
import { postRoutes } from "./routes/postRoutes"
import { dataRoutes } from "./routes/dataRoutes"
import { conversationRoutes } from "./routes/conversationRoutes"
import { messageRoutes } from "./routes/messageRoutes"
import { notificationRoutes } from "./routes/notificationRoutes"
import { commentRoutes } from "./routes/commentRoutes"

import { currentUser } from "./middlewares/currentUser"
import { errorHandler } from "./middlewares/errorHandler"

const app = express()

const isDev = process.env.NODE_ENV === "dev"

console.log(isDev)

// Middlewares
app.set("trust proxy", true)
app.use(json({ limit: "50mb" }))
app.use(
  // cookieSession({
  //   signed: false,
  //   secure: true,
  //   sameSite: "none",
  //   maxAge: 24 * 60 * 60 * 1000,
  // })
  cookieSession({
    signed: false,
    secure: !isDev,
    sameSite: isDev ? "lax" : "none",
    maxAge: 24 * 60 * 60 * 1000,
  })
)
app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(helmet())
// app.use(morgan("combined"))

app.use(currentUser)

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/data", dataRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/conversations", conversationRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/notifications", notificationRoutes)

app.get("/", (req, res) => {
  res.send("Welcome to the API")
})

app.get("/favicon.ico", (req, res) => {
  return res.status(204).send(null)
})
app.get("/favicon.png", (req, res) => {
  return res.status(204).send(null)
})

// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`)
//   next()
// })

app.all("*", async (req, res) => {
  // throw new NotFoundError()
  return res.status(404).send("Route not found")
})

app.use(errorHandler)

export { app }
