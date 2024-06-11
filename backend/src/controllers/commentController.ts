import { Request, Response } from "express"
import { Comment } from "../models/commentModel"

export const commentController = {
  create: async (req: Request, res: Response) => {
    const { content, commentType, fixtureId, playerId, userId } = req.body.data

    try {
      if (commentType === "fixture") {
        const newComment = await Comment.create({
          content: content,
          commentType: commentType,
          fixtureId: fixtureId,
          user: userId,
        })
        await newComment.save()
        return res.status(201).send(newComment)
      } else if (commentType === "player") {
        const newComment = await Comment.create({
          content: content,
          commentType: commentType,
          playerId: playerId,
          user: userId,
        })
        await newComment.save()
        return res.status(201).send(newComment)
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getCommentsByFixture: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const comments = await Comment.find({
        fixtureId: id,
      })
        .populate("user", "username displayName avatar")
        .sort({ voteCount: -1 })

      return res.status(200).send(comments)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getCommentsByPlayer: async (req: Request, res: Response) => {
    const { id } = req.params
    const { range } = req.query

    try {
      let dateLimit = new Date()
      switch (range) {
        case "24h":
          dateLimit.setDate(dateLimit.getDate() - 1)
          break
        case "1w":
          dateLimit.setDate(dateLimit.getDate() - 7)
          break
        case "1m":
          dateLimit.setMonth(dateLimit.getMonth() - 1)
          break
        case "1y":
          dateLimit.setFullYear(dateLimit.getFullYear() - 1)
          break
        case "latest":
          dateLimit = new Date()
          break
        case "all":
          dateLimit = new Date(0)
          break
        default:
          dateLimit = new Date(0)
          break
      }
      const comments = await Comment.find({
        playerId: id,
      }).populate("user", "username displayName avatar")

      if (range !== "latest") {
        comments.sort((a, b) => {
          const voteCountA = a.upvotes.length - a.downvotes.length
          const voteCountB = b.upvotes.length - b.downvotes.length
          return voteCountB - voteCountA
        })
      }

      return res.status(200).send(comments)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  upvoteComment: async (req: Request, res: Response) => {
    const { id } = req.params
    const { type, userId } = req.body.data

    try {
      const comment = await Comment.findById(id)

      if (comment?.downvotes.includes(userId)) {
        await Comment.findByIdAndUpdate(id, {
          $pull: { downvotes: userId },
        })
      }

      if (type === "add") {
        await Comment.findByIdAndUpdate(
          id,
          {
            $addToSet: { upvotes: userId },
          },
          { new: true }
        )
      } else {
        await Comment.findByIdAndUpdate(
          id,
          {
            $pull: { upvotes: userId },
          },
          { new: true }
        )
      }

      const updatedComment = await Comment.findById(id).populate(
        "user",
        "username displayName avatar"
      )

      return res.status(200).send(updatedComment)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  downvoteComment: async (req: Request, res: Response) => {
    const { id } = req.params
    const { type, userId } = req.body.data

    try {
      const comment = await Comment.findById(id)

      if (comment?.upvotes.includes(userId)) {
        await Comment.findByIdAndUpdate(id, {
          $pull: { upvotes: userId },
        })
      }

      if (type === "add") {
        await Comment.findByIdAndUpdate(
          id,
          {
            $addToSet: { downvotes: userId },
          },
          { new: true }
        )
      } else {
        await Comment.findByIdAndUpdate(
          id,
          {
            $pull: { downvotes: userId },
          },
          { new: true }
        )
      }

      const updatedComment = await Comment.findById(id).populate(
        "user",
        "username displayName avatar"
      )
      return res.status(200).send(updatedComment)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
}
