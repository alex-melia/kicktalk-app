import { model, Schema } from "mongoose"

interface IReply {
  content: string
  replyId: String
  userId: String
}

const replySchema = new Schema<IReply>(
  {
    content: {
      type: String,
      required: true,
    },
    replyId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Reply = model("Reply", replySchema)

export { Reply }
