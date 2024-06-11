import { Server } from "socket.io"
import { Comment } from "../models/commentModel"

export const socketController = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("joinFixture", (fixtureId) => {
      socket.join(fixtureId)
      console.log(`${socket.id} joined fixture: ${fixtureId}`)
    })

    socket.on("leaveFixture", (fixtureId) => {
      socket.leave(fixtureId)
      console.log(`${socket.id} left fixture: ${fixtureId}`)
    })

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId)
      console.log(`${socket.id} joined conversation: ${conversationId}`)
    })

    socket.on("leaveConversation", (conversationId) => {
      socket.leave(conversationId)
      console.log(`${socket.id} left conversation: ${conversationId}`)
    })

    socket.on("joinPlayer", (playerId) => {
      socket.join(playerId)
      console.log(`${socket.id} joined player: ${playerId}`)
    })

    socket.on("leavePlayer", (playerId) => {
      socket.leave(playerId)
      console.log(`${socket.id} left player: ${playerId}`)
    })

    socket.on("newComment", async ({ id, comment }) => {
      const nc = await Comment.findById(comment._id).populate(
        "user",
        "username displayName avatar"
      )
      io.to(id).emit("commentReceived", nc)
    })

    socket.on("newMessage", async ({ id, message }) => {
      socket.to(id).emit("messageReceived", message)
    })

    socket.on("disconnect", () => {
      console.log("User disconnected")
    })
  })
}
