import { model, Schema } from "mongoose"

interface IMessage {
  conversationId: string
  sender: Object
  text: String
  media: String
  readBy: Schema.Types.ObjectId[]
  viewableBy: IParticipant[]
}

interface IParticipant {
  user: Schema.Types.ObjectId
}

const participantSchema = new Schema<IParticipant>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
)

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: String,
      requried: true,
    },
    media: {
      type: String,
      required: false,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    readBy: [participantSchema],
    viewableBy: [participantSchema],
  },
  { timestamps: true }
)

const Message = model("Message", messageSchema)

export { Message }
