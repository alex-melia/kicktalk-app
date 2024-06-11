import { model, Schema } from "mongoose"

interface ILike {
  postId: String
  userId: String
}

const likeSchema = new Schema<ILike>(
  {
    postId: {
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

const Like = model("Like", likeSchema)

export { Like }
