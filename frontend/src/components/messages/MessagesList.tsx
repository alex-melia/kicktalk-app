import formatTimestamp from "../../utils/formatTimestamp"
import { useAuth } from "../../contexts/AuthContext"
import { useEffect, useRef } from "react"
import { Message } from "../../types/messages"

interface MessagesList {
  messages: Message[]
}

export default function MessagesList({ messages }: any) {
  const { currentUser } = useAuth()

  const messagesEndRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col gap-2">
      {messages
        .filter((message: any) =>
          message.viewableBy.some((v: any) => v.user === currentUser?.id)
        )
        .map((message: any) => (
          <div
            className={`flex flex-col max-w-xl gap-1 ${
              message.sender._id === currentUser?.id ? "ml-auto" : "mr-auto"
            }`}
            key={message._id}
          >
            <span
              className={`p-2 rounded-xl break-words ${
                message.sender._id === currentUser?.id
                  ? "bg-green-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {message.text}
              {message.media && <img src={message.media} />}
            </span>
            <span
              className={`${
                message.sender._id === currentUser?.id ? "ml-auto" : "mr-auto"
              }`}
            >
              {formatTimestamp(message.createdAt)}
            </span>
          </div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
