import { Request, Response, NextFunction } from "express"
import { Post } from "../models/postModel"
import { Like } from "../models/likeModel"
import { v2 as cloudinary } from "cloudinary"
import { Notification } from "../models/notificationModel"
import { User } from "../models/userModel"
import { Repost } from "../models/repostModel"
import { config } from "../config/env"

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
})

export const postController = {
  create: async (req: Request, res: Response) => {
    const { postType, content, media, fixture, user, replyingTo } =
      req.body.data

    try {
      let imageUrls = []

      if (media && Array.isArray(media)) {
        for (const singleMedia of media) {
          try {
            const result = await cloudinary.uploader.upload(singleMedia)
            imageUrls.push(result.secure_url)
          } catch (error) {
            console.error("Failed to upload image to Cloudinary", error)
          }
        }
      }

      if (postType === "post") {
        const newPost = await Post.create({
          postType: postType,
          content: content,
          media: imageUrls,
          fixture: fixture,
          user: user,
        })
        await newPost.populate("user")
        await newPost.save()
        return res.status(201).send(newPost)
      }

      if (postType === "reply") {
        const newPost = await Post.create({
          postType: postType,
          replyingTo: replyingTo,
          content: content,
          media: media,
          user: user,
        })

        await Notification.create({
          type: "reply",
          post: newPost._id,
          from: user,
          to: replyingTo,
        })

        await Post.findByIdAndUpdate(
          replyingTo,
          {
            $addToSet: { repliedBy: user },
          },
          { new: true }
        )

        await newPost.save()
        await newPost.populate("user", "username displayName avatar")
        return res.status(201).send(newPost)
      }

      if (postType === "repost") {
        const newPost = await Post.create({
          postType: postType,
          content: content,
          user: user,
        })
        await newPost.save()
        return res.status(201).send(newPost)
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.params
    const { action, contentType, otherUserId, currentUserId } = req.body.data

    try {
      if (action === "like") {
        const post = await Post.findById(id)

        if (post?.likedBy.includes(currentUserId)) {
          await Post.findByIdAndUpdate(id, {
            $pull: { likedBy: currentUserId },
          })

          await Like.findOneAndDelete({
            postId: id,
            userId: currentUserId,
          })
        } else {
          await Post.findByIdAndUpdate(
            id,
            {
              $addToSet: { likedBy: currentUserId },
            },
            { new: true }
          )

          await Like.create({
            postId: id,
            userId: currentUserId,
          })

          await Notification.create({
            type: "like",
            contentType: contentType,
            from: currentUserId,
            to: otherUserId,
          })
        }

        const updatedPost = await Post.findById(id).populate(
          "user",
          "username displayName avatar"
        )

        return res.status(200).send(updatedPost)
      } else if (action === "repost") {
        const post = await Post.findById(id)

        if (post?.repostedBy.includes(currentUserId)) {
          await Post.findByIdAndUpdate(id, {
            $pull: { repostedBy: currentUserId },
          })

          await Repost.findOneAndDelete({
            post: id,
            user: currentUserId,
          })
        } else {
          await Post.findByIdAndUpdate(
            id,
            {
              $addToSet: { repostedBy: currentUserId },
            },
            { new: true }
          )

          await Repost.create({
            type: "repost",
            contentType: contentType,
            post: id,
            user: currentUserId,
          })
        }

        const updatedPost = await Post.findById(id).populate(
          "user",
          "username displayName avatar"
        )
        return res.status(200).send(updatedPost)
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  getPosts: async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skipIndex = (page - 1) * limit
    const type = req.query.type
    const userId = req.currentUser?.id

    try {
      if (type === "all") {
        const posts = await Post.find({
          postType: "post",
        })
          .populate("user")
          .populate({
            path: "replyingTo",
            populate: { path: "user" },
          })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skipIndex)

        return res.status(200).send(posts)
      } else if (type == "following") {
        const currentUser = await User.findById(userId).select("following")

        if (!currentUser) {
          return res.status(400).send("No current user")
        }

        const followingIds = currentUser.following.map((user: any) => user._id)

        const posts = await Post.find({
          postType: "post",
          user: { $in: followingIds },
        })
          .populate("user")
          .populate({
            path: "replyingTo",
            populate: { path: "user" },
          })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skipIndex)

        return res.status(200).send(posts)
      } else {
        return res.status(404).send("Not found")
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  getPostById: async (req: Request, res: Response) => {
    const { postId } = req.params
    const userId = req.currentUser?.id

    try {
      const post = await Post.findById(postId)
        .populate("user")
        .populate({
          path: "replyingTo",
          populate: { path: "user" },
        })

      if (!post) {
        return res.status(404).send({ message: "Post not found" })
      }

      const replies = await Post.find({
        postType: "reply",
        replyingTo: postId,
      })
        .populate("user")
        .populate({
          path: "replyingTo",
          populate: { path: "user" },
        })

      const isLiked =
        (await Like.findOne({ postId: postId, userId: userId })) != null

      const postWithLike = {
        post,
        replies,
        isLiked,
      }

      return res.status(200).send(postWithLike)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  getUserPosts: async (req: Request, res: Response) => {
    try {
      const { username } = req.params
      const { postType } = req.query

      const user = await User.findOne({ username })
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      if (postType === "media") {
        const mediaPosts = await Post.find({
          user: user._id,
          media: { $exists: true, $ne: [] },
        })
          .populate("user")
          .populate({
            path: "replyingTo",
            populate: { path: "user" },
          })
          .sort({ createdAt: -1 })

        if (mediaPosts && mediaPosts.length > 0) {
          return res.status(200).send(mediaPosts)
        } else {
          return res.status(200).send(null)
        }
      }

      if (postType === "likes") {
        const userLikes = await Post.find({
          likedBy: { $in: [user._id] },
        })
          .populate("user")
          .populate({
            path: "replyingTo",
            populate: { path: "user" },
          })
          .sort({ createdAt: -1 })

        if (userLikes && userLikes.length > 0) {
          return res.status(200).send(userLikes)
        } else {
          return res.status(200).send(null)
        }
      }

      if (postType === "reply") {
        const userReplies = await Post.find({
          user: user._id,
          postType: "reply",
        })
          .populate("user")
          .populate({
            path: "replyingTo",
            populate: { path: "user" },
          })
          .sort({ createdAt: -1 })

        if (userReplies && userReplies.length > 0) {
          return res.status(200).send(userReplies)
        } else {
          return res.status(200).send(null)
        }
      }

      const userPosts = await Post.find({
        user: user._id,
        // ...(postType ? { postType } : {}),
        postType: "post",
      })
        .populate("user")
        .populate({
          path: "replyingTo",
          populate: { path: "user" },
        })
        .sort({ createdAt: -1 })

      return res.status(200).send(userPosts)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  getTopPosts: async (req: Request, res: Response) => {
    try {
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const posts = await Post.find({
        postType: "post",
        createdAt: {
          $gte: oneDayAgo,
          $lte: now,
        },
      })
        .populate("user")
        .populate({
          path: "replyingTo",
          populate: { path: "user" },
        })
        .sort({ likedBy: -1 })

      if (posts) {
        return res.status(200).send(posts)
      } else {
        return res.status(404).send("No posts found")
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  getMostReplied: async (req: Request, res: Response) => {
    try {
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const posts = await Post.find({
        postType: "post",
        createdAt: {
          $gte: oneDayAgo,
          $lte: now,
        },
      })
        .populate("user")
        .populate({
          path: "replyingTo",
          populate: { path: "user" },
        })
        .sort({ repliedBy: -1 })

      if (posts) {
        return res.status(200).send(posts)
      } else {
        return res.status(404).send("No posts found")
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  getFixturePosts: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { type } = req.body.data

      if (type === "top-posts") {
        const posts = await Post.find({ "fixture.id": Number(id) })
          .populate("user")
          .populate({
            path: "replyingTo",
            populate: { path: "user" },
          })

        posts.sort((a: any, b: any) => b.likeCount - a.likeCount)

        return res.status(200).send(posts)
      } else {
        const posts = await Post.find({ "fixture.id": Number(id) })
          .populate("user")
          .populate({
            path: "replyingTo",
            populate: { path: "user" },
          })
          .sort({ createdAt: -1 })

        return res.status(200).send(posts)
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  likePost: async (req: Request, res: Response) => {
    const { postId } = req.params
    const { currentUserId } = req.body.data

    try {
      const post = await Post.findById(postId)

      if (post?.likedBy.includes(currentUserId)) {
        await Post.findByIdAndUpdate(postId, {
          $pull: { likedBy: currentUserId },
        })

        await Like.findOneAndDelete({
          postId: postId,
          userId: currentUserId,
        })
      } else {
        await Post.findByIdAndUpdate(
          postId,
          {
            $addToSet: { likedBy: currentUserId },
          },
          { new: true }
        )

        await Like.create({
          postId: postId,
          userId: currentUserId,
        })
      }

      const updatedPost = await Post.findById(postId).populate(
        "user",
        "username displayName avatar"
      )

      return res.status(200).send(updatedPost)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  unlikePost: async (req: Request, res: Response) => {
    const { postId, userId } = req.params
    const { currentUserId } = req.body.data

    try {
      const post = await Post.findById(postId)

      if (post?.likedBy.includes(currentUserId)) {
        await Post.findByIdAndUpdate(postId, {
          $pull: { likedBy: currentUserId },
        })
      } else {
        await Post.findByIdAndUpdate(
          postId,
          {
            $addToSet: { likedBy: currentUserId },
          },
          { new: true }
        )
      }

      const updatedPost = await Post.findById(postId).populate(
        "user",
        "username displayName avatar"
      )

      return res.status(200).send(updatedPost)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  repostPost: async (req: Request, res: Response) => {
    const { postId, currentUserId } = req.params
    const { otherUserId } = req.body.data

    try {
      const newRepost = await Repost.create({
        post: postId,
        user: currentUserId,
      })

      const post = await Post.findById(postId)

      const newNotification = await Notification.create({
        type: "repost",
        contentType: post?.postType,
        from: currentUserId,
        to: otherUserId,
      })

      return res.status(200).send(newRepost)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  unrepostPost: async (req: Request, res: Response) => {
    const { postId, userId } = req.params

    try {
      const removeRepost = await Repost.deleteOne({
        postId: postId,
        userId: userId,
      })
      return res.status(200).send(removeRepost)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
}
