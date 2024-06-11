import { Server } from "socket.io"

export const io = new Server()

io.on("connection", (socket) => {
  console.log("User connected")

  socket.on("joinFixture", (fixtureId) => {
    socket.join(fixtureId)
    console.log(`A user joined fixture: ${fixtureId}`)
  })
  socket.on("joinPlayer", (playerId) => {
    socket.join(playerId)
    console.log(`A user joined player: ${playerId}`)
  })

  socket.on("newComment", ({ fixtureId, comment }) => {
    io.to(fixtureId).emit("commentReceived", comment)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
})
