import dotenv from "dotenv"

dotenv.config({ path: "./config.env" })

export const config = {
  dbUri: process.env.DATABASE?.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD || ""
  ),
  redisUrl: process.env.REDIS_URL,
  redisPassword: process.env.REDIS_PASSWORD,
  redisPort: process.env.REDIS_PORT,
  port: process.env.PORT || 5174,
  socketPort: process.env.SOCKET_PORT || 5173,
  corsOrigin:
    process.env.NODE_ENV === "prod"
      ? process.env.CORS_ORIGIN_URL
      : "http://localhost:5173",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
}
