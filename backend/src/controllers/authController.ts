import { Request, Response } from "express"
import { User } from "../models/userModel"
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from "cloudinary"
import bcrypt from "bcryptjs"
import { config } from "../config/env"

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
})

export const authController = {
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body.data

    try {
      if (!username || !password) {
        return res
          .status(401)
          .send({ error: "Username and/or password are null" })
      }

      const user = await User.findOne({ username }).select("+password")

      if (!user) {
        return res.status(401).send({ error: "Incorrect username or password" })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).send({ error: "Incorrect username or password" })
      }

      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
          bio: user.bio,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          team: user.team,
        },
        `${process.env.JWT_SECRET}`
      )

      req.session = {
        jwt: userJwt,
      }

      return res.status(200).send(req.currentUser)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  logout: (req: Request, res: Response) => {
    req.session = null
    return res.status(200).send({})
  },

  signup: async (req: Request, res: Response) => {
    const { email, username, password, avatar, team } = req.body.data
    try {
      // Default user image
      let imageUrl =
        "https://res.cloudinary.com/dmztnqpzb/image/upload/v1715602450/default-user.png"

      if (avatar) {
        const result = await cloudinary.uploader.upload(avatar)
        imageUrl = result.secure_url
      }

      const newUser = await User.create({
        email: email,
        username: username,
        displayName: username,
        password: password,
        avatar: imageUrl,
        team: team,
      })
      await newUser.save()
      const userJwt = jwt.sign(
        {
          id: newUser.id,
        },
        "12345"
      )

      req.session = {
        jwt: userJwt,
      }

      return res.status(201).send(newUser)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  changePassword: async (req: Request, res: Response) => {
    const { currentPassword, newPassword, confirmPassword } = req.body.data
    const { id } = req.params

    try {
      const user = await User.findById(id)

      if (!user) {
        return res.status(400).send("No such user exists!")
      }

      if (typeof user?.password === "undefined") {
        return res.status(400).send("User password not set.")
      }

      const isMatch = await bcrypt.compare(currentPassword, user?.password)
      if (!isMatch) {
        return res.status(400).send("Incorrect password!")
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).send("Passwords do not match!")
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12)
      await user.updateOne({
        password: hashedNewPassword,
      })

      return res.status(200).send("Successfully changed password")
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  currentuser: async (req: Request, res: Response) => {
    return res.send({ currentUser: req.currentUser || null })
  },
}
