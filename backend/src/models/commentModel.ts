import { model, Schema } from "mongoose"

interface IComment {
  commentType: String
  user: Object
  content: String
  fixtureId: String
  playerId: String
  fixtureMinute: Number
  upvotes: [{ type: Schema.Types.ObjectId; ref: "User" }]
  downvotes: [{ type: Schema.Types.ObjectId; ref: "User" }]
  voteCount: Number
}

const commentSchema = new Schema<IComment>(
  {
    commentType: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    fixtureId: {
      type: String,
      required: false,
    },
    playerId: {
      type: String,
      required: false,
    },
    fixtureMinute: {
      type: Number,
      required: false,
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
)

commentSchema.virtual("voteCount").get(function () {
  return this.upvotes.length - this.downvotes.length
})

commentSchema.set("toJSON", { virtuals: true })
commentSchema.set("toObject", { virtuals: true })

const Comment = model("Comment", commentSchema)

export { Comment }
