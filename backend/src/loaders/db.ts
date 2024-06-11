import mongoose from "mongoose"
import { config } from "../config/env"

export const connectToDB = async () => {
  try {
    if (!config.dbUri) {
      throw new Error("Database URI is not defined")
    }
    await mongoose.connect(config.dbUri)
    console.log("Connected to database!")
    console.log(process.env.JWT_SECRET)
  } catch (err) {
    console.error("Database connection error:", err)
    process.exit(1)
  }
}
//
