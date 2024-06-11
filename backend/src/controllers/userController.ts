import { Request, Response } from "express"
import { User } from "../models/userModel"
import { Notification } from "../models/notificationModel"
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from "cloudinary"
import { config } from "../config/env"

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
})

export const userController = {
  getUserByUsername: async (req: Request, res: Response) => {
    const { username } = req.params

    try {
      const user = await User.findOne({ username })
      return res.status(200).send(user)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  followUser: async (req: Request, res: Response) => {
    const { currentUserId, targetUserId } = req.body.data

    try {
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: targetUserId },
        $inc: { followingCount: 1 },
      })

      await User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: currentUserId },
        $inc: { followersCount: 1 },
      })

      await Notification.create({
        type: "follow",
        from: currentUserId,
        to: targetUserId,
      })

      return res.status(200).send(true)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  unfollowUser: async (req: Request, res: Response) => {
    const { currentUserId, targetUserId } = req.body.data
    try {
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId },
        $inc: { followingCount: -1 },
      })

      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId },
        $inc: { followersCount: -1 },
      })

      return res.status(200).send(false)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  checkFollowing: async (req: Request, res: Response) => {
    try {
      const { currentUserId, targetUserId } = req.body.data

      if (!currentUserId || !targetUserId) {
        return res.status(400).json({ message: "Missing User ID(s)." })
      }

      const user = await User.findById(currentUserId)

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      const isFollowing = user.following.some(
        (id) => id.toString() === targetUserId
      )

      return res.status(200).send(isFollowing)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  searchUsers: async (req: Request, res: Response) => {
    const query = req.query.query
    try {
      const users = await User.find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { displayName: { $regex: query, $options: "i" } },
        ],
      })

      if (!users) {
        return res.status(400).send("No users")
      }

      return res.status(200).send(users)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  editUser: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const { data, type } = req.body.data

      if (!data) {
        return res.status(400).json({ message: "Missing data" })
      }

      if (type === "username") {
        const user = await User.findByIdAndUpdate(
          id,
          {
            username: data,
          },
          { new: true }
        )
        if (!user) {
          return res.status(404).json({ message: "User not found" })
        }

        const updatedJwt = jwt.sign(
          {
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            bio: user.bio,
            avatar: user.avatar,
            team: user.team,
          },
          process.env.JWT_SECRET!
        )

        req.session = {
          jwt: updatedJwt,
        }

        return res.status(200).send(user)
      }

      if (type === "email") {
        const user = await User.findByIdAndUpdate(
          id,
          {
            email: data,
          },
          { new: true }
        )
        if (!user) {
          return res.status(404).json({ message: "User not found" })
        }

        const updatedJwt = jwt.sign(
          {
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            bio: user.bio,
            avatar: user.avatar,
            team: user.team,
          },
          process.env.JWT_SECRET!
        )

        req.session = {
          jwt: updatedJwt,
        }

        return res.status(200).send(user)
      }

      if (type === "profile") {
        let updateData: any = {
          displayName: data.displayName,
          bio: data.bio,
        }

        if (data.avatar) {
          const result = await cloudinary.uploader.upload(data.avatar)
          const imageUrl = result.secure_url
          updateData.avatar = imageUrl
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true })
        if (!user) {
          return res.status(404).json({ message: "User not found" })
        }

        const updatedJwt = jwt.sign(
          {
            id: user.id,
            email: user.email,
            bio: user.bio,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
            team: user.team,
          },
          process.env.JWT_SECRET!
        )

        req.session = {
          jwt: updatedJwt,
        }
        return res.status(200).send(user)
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  suggestUsers: async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const currentUser = await User.findById(id)

      const suggestions = await User.aggregate([
        {
          $match: {
            _id: { $ne: id },
            "team.team": currentUser?.team.team,
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "user",
            as: "posts",
          },
        },
        {
          $addFields: {
            postCount: { $size: "$posts" },
            likeCount: { $sum: "$posts.likeCount" },
          },
        },
        {
          $project: {
            username: 1,
            displayName: 1,
            avatar: 1,
            bio: 1,
            score: {
              $add: [
                {
                  $multiply: [
                    {
                      $cond: [
                        { $eq: ["$team.team", currentUser?.team.team] },
                        1,
                        0,
                      ],
                    },
                    10,
                  ],
                },
                { $multiply: ["$postCount", 5] },
                { $multiply: ["$likeCount", 2] },
              ],
            },
          },
        },
        { $sort: { score: -1 } },
        { $limit: 5 },
      ])

      return res.status(200).send(suggestions)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
}
