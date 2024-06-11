import { Request, Response, NextFunction } from "express"
import { Conversation } from "../models/conversationModel"
import { Message } from "../models/messageModel"

export const conversationController = {
  create: async (req: Request, res: Response) => {
    const { currentUserId, targetUserId } = req.body.data

    try {
      const existingConversation = await Conversation.findOne({
        "participants.user": {
          $all: [currentUserId, targetUserId],
        },
      })

      if (existingConversation) {
        await Conversation.updateOne(
          { _id: existingConversation._id, "participants.user": currentUserId },
          { $set: { "participants.$.active": true } }
        )

        await Conversation.updateOne(
          { _id: existingConversation._id, "participants.user": targetUserId },
          { $set: { "participants.$.active": true } }
        )
        return res.status(200).send(existingConversation?._id)
      } else {
        const newConversation = await Conversation.create({
          participants: [
            { user: currentUserId, active: true },
            { user: targetUserId, active: false },
          ],
          isRequested: true,
          requestedBy: currentUserId,
        })
        await newConversation.save()
        return res.status(201).send(newConversation._id)
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getConversation: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const conversation = await Conversation.findById(id)
        .populate(
          "participants.user",
          "username displayName avatar bio followersCount"
        )
        .exec()

      return res.status(200).send(conversation)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getConversationsByUser: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const rconversations = await Conversation.find({
        participants: {
          $elemMatch: {
            user: id,
            $or: [{ active: false }],
          },
        },
        isRequested: true,
      })
        .populate("participants.user", "username displayName avatar")
        .exec()

      const conversations = await Conversation.find({
        participants: {
          $elemMatch: {
            user: id,
            $or: [{ active: true }],
          },
        },
      })
        .populate("participants.user", "username displayName avatar")
        .exec()

      if (conversations || rconversations) {
        return res.status(200).send({ rconversations, conversations })
      } else {
        return res.status(404).send({ message: "Conversation not found" })
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getConversationsByQuery: async (req: Request, res: Response) => {
    const { id } = req.params
    const query = req.query.query

    try {
      console.log(query)

      const rconversations = await Conversation.find({
        participants: {
          $elemMatch: {
            "user.username": { $regex: query, $options: "i" },
            $or: [{ active: false }],
          },
        },
        isRequested: true,
      })
        .populate("participants.user", "username displayName avatar")
        .exec()

      const conversations = await Conversation.find({
        participants: {
          $elemMatch: {
            "user.username": { $regex: query, $options: "i" },
            $or: [{ active: true }],
          },
        },
      })
        .populate("participants.user", "username displayName avatar")
        .exec()

      if (conversations || rconversations) {
        return res.status(200).send({ rconversations, conversations })
      } else {
        return res.status(404).send({ message: "Conversation not found" })
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  acceptConversation: async (req: Request, res: Response) => {
    const { id } = req.params
    const { currentUserId } = req.body.data

    try {
      const conversation = await Conversation.findByIdAndUpdate(
        id,
        {
          $set: {
            "participants.$[elem].active": true,
            isRequested: false,
            requestedBy: false,
          },
        },
        {
          new: true, // Return the modified document rather than the original
          arrayFilters: [{ "elem.user": currentUserId }], // Specify the filter condition for which array element to modify
        }
      )
        .populate("participants.user", "username displayName avatar")
        .exec()

      return res.status(200).send(conversation)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  declineConversation: async (req: Request, res: Response) => {
    const { id } = req.params
    const { currentUserId } = req.body.data

    try {
      const conversation = await Conversation.findByIdAndUpdate(
        id,
        {
          $set: {
            "participants.$[elem].active": false,
            isRequested: false,
            requestedBy: null,
          },
        },
        {
          new: true, // Return the modified document rather than the original
          arrayFilters: [{ "elem.user": currentUserId }], // Specify the filter condition for which array element to modify
        }
      )
        .populate("participants.user", "username displayName avatar")
        .exec()

      await Message.updateMany(
        { conversationId: id },
        {
          $pull: {
            viewableBy: { user: currentUserId }, // Specify the condition to remove the user from viewableBy
          },
        }
      )

      await Message.deleteMany({
        conversationId: id,
        viewableBy: { $size: 0 },
      })

      const areAllParticipantsInactive = conversation?.participants.every(
        (participant) => !participant.active
      )

      if (areAllParticipantsInactive) {
        await Conversation.findByIdAndDelete(id)
      }

      return res.status(200).send(conversation)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  leaveConversation: async (req: Request, res: Response) => {
    const { id } = req.params
    const { currentUserId } = req.body.data

    try {
      const conversation = await Conversation.findByIdAndUpdate(
        id,
        {
          $set: {
            "participants.$[elem].active": false,
            isRequested: false,
            requestedBy: null,
          },
        },
        {
          new: true, // Return the modified document rather than the original
          arrayFilters: [{ "elem.user": currentUserId }], // Specify the filter condition for which array element to modify
        }
      )
        .populate("participants.user", "username displayName avatar")
        .exec()

      await Message.updateMany(
        { conversationId: id },
        {
          $pull: {
            viewableBy: { user: currentUserId }, // Specify the condition to remove the user from viewableBy
          },
        }
      )

      await Message.deleteMany({
        conversationId: id,
        viewableBy: { $size: 0 },
      })

      const areAllParticipantsInactive = conversation?.participants.every(
        (participant) => !participant.active
      )

      if (areAllParticipantsInactive) {
        await Conversation.findByIdAndDelete(id)

        return res.status(200).send(conversation)
      }

      if (conversation) {
        return res.status(200).send(conversation)
      } else {
        return res.status(404).send({ message: "Conversation not found" })
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
}
