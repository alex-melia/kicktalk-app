import { model, Schema } from "mongoose"

interface IRepost {
  post: Object
  user: Object
  createdAt?: Date
  updatedAt?: Date
}

const repostSchema = new Schema<IRepost>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

const Repost = model("Repost", repostSchema)

export { Repost }
