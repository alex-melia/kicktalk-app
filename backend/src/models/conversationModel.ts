import { model, Schema } from "mongoose"

interface IParticipant {
  user: Schema.Types.ObjectId
  active: boolean
}

interface IConversation extends Document {
  participants: IParticipant[]
  isRequested: boolean | null
  requestedBy: string | null
}

const participantSchema = new Schema<IParticipant>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    active: { type: Boolean, default: true },
  },
  { _id: false }
)

const conversationSchema = new Schema<IConversation>(
  {
    participants: [participantSchema],
    isRequested: {
      type: Boolean,
      required: false,
    },
    requestedBy: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
)

const Conversation = model("Conversation", conversationSchema)

export { Conversation }
