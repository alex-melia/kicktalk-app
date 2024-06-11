import { Request, Response, NextFunction } from "express"
import { Notification } from "../models/notificationModel"

export const notificationController = {
  getNotifications: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const notifications = await Notification.find({
        from: { $ne: id },
        to: id,
      })
        .populate("from", "username displayName avatar")
        .populate(
          "post",
          "content user likeCount replyCount repostCount createdAt"
        )
        .sort({ createdAt: -1 })
        .exec()

      return res.status(200).send(notifications)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  countNotifications: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const notificationsCount = await Notification.countDocuments({
        from: { $ne: id },
        to: id,
        read: false,
      })
      return res.status(200).send(notificationsCount.toString())
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  readNotifications: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const notifications = await Notification.updateMany(
        { to: id, read: false },
        { $set: { read: true } }
      )

      return res.status(200).send(notifications)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
}
