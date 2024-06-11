import { app } from "./app"
import { config } from "./config/env"
import { socketController } from "./controllers/socketController"
import { connectToDB } from "./loaders/db"
import { connectToRedis } from "./loaders/redis"
import { Server } from "socket.io"
import http from "http"

import { dailyJobs } from "./jobs/scheduler"

import dotenv from "dotenv"
dotenv.config({ path: "./config.env" })

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
})

socketController(io)

const startServer = async () => {
  await connectToDB()
  await connectToRedis()

  dailyJobs()

  server.listen(config.socketPort, () => {
    console.log(`Server and Socket.IO listening on port ${config.socketPort}`)
  })

  app.listen(config.port, () => {
    console.log(`App listening on port ${config.port}`)
  })

  const isDev = process.env.NODE_ENV === "dev"

  console.log(isDev)
}
//
startServer()
