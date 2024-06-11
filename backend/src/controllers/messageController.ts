import { Request, Response, NextFunction } from "express"
import { v2 as cloudinary } from "cloudinary"
import { Message } from "../models/messageModel"
import { Conversation } from "../models/conversationModel"
import { config } from "../config/env"

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
})

export const messageController = {
  create: async (req: Request, res: Response) => {
    const { conversationId, text, media, senderId, targetUserId } =
      req.body.data

    try {
      let imageUrl = ""

      if (media) {
        try {
          const result = await cloudinary.uploader.upload(media)
          imageUrl = result.secure_url
        } catch (error) {
          console.error("Failed to upload image to Cloudinary", error)
        }
      }

      const newMessage = await Message.create({
        conversationId: conversationId,
        text: text,
        media: imageUrl,
        sender: senderId,
        readBy: [{ user: senderId }],
        viewableBy: [{ user: senderId }, { user: targetUserId }],
      })
      await newMessage.save()
      await newMessage.populate("sender", "username displayName avatar")

      const conversation = await Conversation.findById(conversationId)
      if (conversation && conversation.isRequested === false) {
        conversation.isRequested = true
        conversation.requestedBy = senderId

        await conversation.save()
      }

      return res.status(201).send(newMessage)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getMessages: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const messages = await Message.find({
        conversationId: id,
      })
        .populate("sender", "username displayName avatar")
        .exec()

      return res.status(200).send(messages)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  readMessages: async (req: Request, res: Response) => {
    const { id } = req.params
    const { conversationId } = req.body.data

    try {
      const messages = await Message.updateMany(
        { conversationId: conversationId, "readBy.user": { $ne: id } },
        { $addToSet: { readBy: { user: id } } }
      )

      return res.status(200).send(messages)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  countMessages: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const messagesCount = await Message.countDocuments({
        "readBy.user": { $ne: id },
        "viewableBy.user": { $eq: id },
      })

      return res.status(200).send(messagesCount.toString())
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
}
