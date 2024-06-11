import { User } from "../types"

export interface Participant {
  user: User
  active: boolean
}

export interface Conversation {
  _id: string
  isRequested?: boolean
  requestedBy?: string
  participants: Participant[]
}

export interface Message {
  conversationId: string
  sender: Object
  text: string
  media: string
  readBy: Participant[]
  viewableBy: Participant[]
}

export interface MessageConversations {
  rconversations: Conversation[]
  conversations: Conversation[]
}
