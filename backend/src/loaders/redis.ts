// import { createClient } from "redis"
// import { config } from "../config/env"

// const client = createClient({
//   url: config.redisUrl,
//   password: config.redisPassword,
// })

// client.on("error", (err) => console.log("Redis Client Error", err))

// export const connectToRedis = async () => {
//   try {
//     await client.connect()
//     console.log("Connected to Redis!")
//   } catch (err) {
//     console.error("Redis connection error:", err)
//     process.exit(1)
//   }
// }

// export default client

// const client = createClient()
import { createClient } from "redis"
import { config } from "../config/env"

const client = createClient({
  password: config.redisPassword,
  socket: {
    host: config.redisUrl,
    port: Number(config.redisPort),
  },
})

export const connectToRedis = async () => {
  try {
    await client.connect()
    console.log("Connected to Redis!")
  } catch (err) {
    console.error("Redis connection error:", err)
    process.exit(1)
  }
}

export default client
