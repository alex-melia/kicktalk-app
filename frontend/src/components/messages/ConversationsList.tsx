import { Dispatch, SetStateAction } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Conversation } from "../../types/messages"

interface ConversationsListProps {
  conversations: {
    rconversations: Conversation[]
    conversations: Conversation[]
  }
  setConversation: Dispatch<SetStateAction<Conversation | null>>
}

export default function ConversationsList({
  conversations,
}: ConversationsListProps) {
  const { currentUser } = useAuth()

  return (
    <>
      <div className="flex flex-col items-center w-full gap-2">
        {conversations.rconversations.length > 0 && (
          <span>Requested Conversations</span>
        )}
        {conversations.rconversations.map((conversation: any) => (
          <Link
            to={`/messages/${conversation._id}`}
            key={conversation._id}
            className="flex w-full items-center gap-2 p-2 hover:bg-gray-200 rounded-lg"
          >
            {conversation.participants
              .filter(
                (participant: any) => participant.user._id !== currentUser?.id
              )
              .map((participant: any) => (
                <>
                  <img
                    src={participant.user.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full"
                  />
                  <div>
                    <span className="font-bold text-lg">
                      {participant.user.displayName}
                    </span>
                    <span> @{participant.user.username}</span>
                  </div>
                </>
              ))}
          </Link>
        ))}
      </div>
      <div className="flex flex-col items-center w-full gap-2">
        {conversations.conversations.length === 0 && (
          <span className="mt-2">You have no conversations!</span>
        )}
        {conversations.conversations.map((conversation: any) => (
          <Link
            to={`/messages/${conversation._id}`}
            key={conversation._id}
            className="flex w-full items-center gap-2 p-2 hover:bg-gray-200 rounded-lg"
          >
            {conversation.participants
              .filter(
                (participant: any) => participant.user._id !== currentUser?.id
              )
              .map((participant: any) => (
                <>
                  <img
                    src={participant.user.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full"
                  />
                  <div>
                    <span className="font-bold text-lg">
                      {participant.user.displayName}
                    </span>
                    <span> @{participant.user.username}</span>
                  </div>
                </>
              ))}
          </Link>
        ))}
      </div>
    </>
  )
}
