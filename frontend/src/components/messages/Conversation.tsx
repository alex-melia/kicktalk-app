import { FormEvent, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Socket } from "socket.io-client"
import { FiTrash } from "react-icons/fi"
import { HiArrowLeft } from "react-icons/hi2"
import { AiFillPicture } from "react-icons/ai"
import { PiGifFill } from "react-icons/pi"
import {
  Conversation as IConversation,
  Message,
  Participant,
} from "../../types/messages"

import { useAuth } from "../../contexts/AuthContext"
import { useModal } from "../../contexts/ModalContext"
import useAxios from "../../hooks/useAxios"

import MessagesList from "./MessagesList"
import GifModal from "../../modals/GifModal"
import Loading from "../common/Loading"

interface ConversationProps {
  initialConversation: IConversation
  socket: Socket
}

export default function Conversation({
  initialConversation,
  socket,
}: ConversationProps) {
  const { id } = useParams<string>()
  const { currentUser } = useAuth()
  const { loading, axiosFetch } = useAxios()
  const { showModal } = useModal()
  const navigate = useNavigate()

  const [text, setText] = useState<string>("")
  const [messages, setMessages] = useState<Message[] | []>([])
  const [conversation, setConversation] = useState<IConversation | null>(
    initialConversation
  )
  const [media, setMedia] = useState<string | ArrayBuffer | null>(null)

  useEffect(() => {
    if (!socket) return
    socket.emit("joinConversation", id)

    return () => {
      socket.emit("leaveConversation", id)
      socket.off("messageReceived")
    }
  }, [id, socket])

  useEffect(() => {
    const handleMessageReceived = (data: Message) => {
      setMessages((currentMessages) => [...currentMessages, data])
    }

    if (socket) {
      socket.on("messageReceived", handleMessageReceived)
    }

    return () => {
      if (socket) {
        socket.off("messageReceived", handleMessageReceived)
      }
    }
  }, [socket])

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/messages/${conversation?._id}`,
      onSuccess(data) {
        setMessages(data)
      },
    })
  }, [conversation])

  useEffect(() => {
    axiosFetch({
      method: "post",
      url: `/api/messages/read/${currentUser?.id}`,
      requestConfig: {
        data: {
          conversationId: conversation?._id,
        },
      },
    })
  }, [conversation, currentUser?.id])

  if (!conversation) {
    return null
  }

  const currentUserParticipant = conversation.participants.find(
    (participant: Participant) => participant.user._id === currentUser?.id
  )

  const otherParticipant = conversation.participants.find(
    (participant: Participant) => participant.user._id !== currentUser?.id
  )

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()

    axiosFetch({
      method: "post",
      url: "/api/messages",
      requestConfig: {
        data: {
          conversationId: conversation._id,
          text: text,
          media: media,
          senderId: currentUser?.id,
          targetUserId: otherParticipant?.user._id,
        },
      },
      onSuccess(data) {
        setMessages([...messages, data])
        setMedia(null)
        socket.emit("newMessage", { id: id, message: data })
      },
    })
    setText("")
  }

  const acceptConversation = async () => {
    axiosFetch({
      method: "put",
      url: `/api/conversations/accept/${conversation._id}`,
      requestConfig: {
        data: {
          currentUserId: currentUser?.id,
        },
      },
      onSuccess(data) {
        setConversation(data)
      },
    })
  }

  const declineConversation = async () => {
    axiosFetch({
      method: "put",
      url: `/api/conversations/decline/${conversation._id}`,
      requestConfig: {
        data: {
          currentUserId: currentUser?.id,
        },
      },
      onSuccess(data) {
        setConversation(data)
        navigate("/messages")
      },
    })
  }

  const leaveConversation = async () => {
    axiosFetch({
      method: "put",
      url: `/api/conversations/leave/${conversation._id}`,
      requestConfig: {
        data: {
          currentUserId: currentUser?.id,
        },
      },
      onSuccess() {
        setConversation(null)
        navigate("/messages")
      },
    })
  }

  function handleFileChange(e: any) {
    const file = e.target.files[0] // Get the first file
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMedia(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleSelectGif(gifUrl: string) {
    setMedia(gifUrl)
  }

  console.log(conversation)

  return (
    <div className="relative flex flex-col col-span-8 border-l h-full md:h-screen w-full">
      <div className="flex sticky top-16 sm:top-0 bg-white justify-between items-center w-full p-4 border-b">
        <Link to={"/messages"}>
          <HiArrowLeft
            size={32}
            className="font-bold"
            onClick={() => {
              navigate(-1)
            }}
          />
        </Link>
        <span className="font-bold text-xl">
          {otherParticipant?.user.displayName}
        </span>
        <div
          onClick={() => leaveConversation()}
          className="flex flex-col items-center cursor-pointer"
        >
          <FiTrash color="red" size={32} />
          <span className="text-red-500">Leave</span>
        </div>
      </div>
      <div className="w-full h-screen mb-28 sm:mb-10 overflow-y-auto">
        <div className="flex flex-col items-center w-full my-6 border-b">
          {conversation.participants
            .filter(
              (participant: Participant) =>
                participant.user._id !== currentUser?.id
            )
            .map((participant: Participant) => (
              <>
                <img className="w-24" src={participant.user.avatar} />
                <span className="font-bold text-xl">
                  {participant.user.displayName}
                </span>
                <span className="text-lg">@{participant.user.username}</span>
                <span className="my-4">{participant.user.bio}</span>
                <span className="mb-4">
                  {!participant.user.followersCount
                    ? 0
                    : participant.user.followersCount}{" "}
                  Followers
                </span>
              </>
            ))}
        </div>
        <div className="w-full p-2">
          {messages && <MessagesList messages={messages} />}
        </div>
      </div>
      <div className="flex sticky bottom-16 sm:bottom-0 absolute bottom-0 justify-center w-full items-center p-2 border-t">
        {currentUserParticipant && !currentUserParticipant.active ? (
          <div className="flex flex-col gap-2 justify-center items-center p-4 bg-green-100 border-b">
            <span className="text-green-600">
              Would you like to accept conversation request from{" "}
              {otherParticipant?.user.displayName}?
            </span>
            <div className="flex gap-4 text-xl font-bold">
              <span
                onClick={() => acceptConversation()}
                className="bg-green-500 p-1 px-2 rounded-xl cursor-pointer"
              >
                Yes
              </span>
              <span
                onClick={() => declineConversation()}
                className="bg-red-500 p-1 rounded-xl px-2 cursor-pointer"
              >
                No
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-14">
              {media && (
                <img src={media as string} alt="Selected" className="w-48" />
              )}
            </div>

            <form
              onSubmit={sendMessage}
              className="flex absolute bottom-0 items-center gap-2 h-14 border w-full p-2 mx-4 bg-gray-100"
            >
              <label
                className="hover:bg-green-400 cursor-pointer p-1 rounded-full transition"
                htmlFor="media"
              >
                <AiFillPicture size={24} />
              </label>
              <input
                multiple
                id="media"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <div
                className="hover:bg-green-400 hover:cursor-pointer p-1 rounded-full transition"
                onClick={() =>
                  showModal(<GifModal onSelectGif={handleSelectGif} />)
                }
              >
                <PiGifFill size={24} />
              </div>
              <input
                className="p-2 bg-gray-100 w-full text-lg"
                placeholder="Start a new message"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                className={`${
                  loading && `disabled`
                } bg-green-500 p-2 px-4 rounded-3xl text-white cursor-pointer font-bold`}
              >
                {loading ? (
                  <div className="flex justify-center">
                    <Loading />
                  </div>
                ) : (
                  <span>Post</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
