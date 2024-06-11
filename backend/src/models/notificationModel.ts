import { model, Schema } from "mongoose"

interface INotification {
  type: string
  contentType?: string
  post?: Object
  read: boolean
  from: Object
  to: Object
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: false,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: false,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

const Notification = model("Notification", notificationSchema)

export { Notification }
