import { model, Schema } from "mongoose"

interface IPost {
  postType: String
  content: String
  media: String[]
  user: Object
  replyingTo: Object
  fixture: Object
  likedBy: [{ type: Schema.Types.ObjectId; ref: "User" }]
  repliedBy: [{ type: Schema.Types.ObjectId; ref: "User" }]
  repostedBy: [{ type: Schema.Types.ObjectId; ref: "User" }]
  likeCount: Number
  replyCount: Number
  repostCount: Number
}

const postSchema = new Schema<IPost>(
  {
    postType: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    media: {
      type: [],
      required: false,
    },
    fixture: {
      type: Object,
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replyingTo: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: false,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    repliedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    repostedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
)

postSchema.virtual("likeCount").get(function () {
  return this.likedBy.length
})

postSchema.virtual("replyCount").get(function () {
  return this.repliedBy.length
})
postSchema.virtual("repostCount").get(function () {
  return this.repostedBy.length
})

postSchema.set("toJSON", { virtuals: true })
postSchema.set("toObject", { virtuals: true })

const Post = model("Post", postSchema)

export { Post }
