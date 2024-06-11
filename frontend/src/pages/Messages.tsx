import { useEffect, useState } from "react"
import { BsEnvelopePlus } from "react-icons/bs"

import { useAuth } from "../contexts/AuthContext"
import Conversation from "../components/messages/Conversation"
import ConversationsList from "../components/messages/ConversationsList"
import useAxios from "../hooks/useAxios"
import { useParams } from "react-router-dom"
import { useModal } from "../contexts/ModalContext"
import MessagesModal from "../modals/MessagesModal"
import { Socket } from "socket.io-client"
import {
  Conversation as IConversation,
  MessageConversations,
} from "../types/messages"

interface MessagesProps {
  socket: Socket
}

export default function Messages({ socket }: MessagesProps) {
  const { id } = useParams<string>()
  const { currentUser } = useAuth()
  const { axiosFetch } = useAxios()
  const { showModal } = useModal()

  const [conversation, setConversation] = useState<IConversation | null>(null)
  const [conversations, setConversations] =
    useState<MessageConversations | null>(null)

  useEffect(() => {
    if (currentUser?.id) {
      axiosFetch({
        method: "get",
        url: `/api/conversations/byuser/${currentUser?.id}`,
        onSuccess(data) {
          setConversations(data)
        },
      })
    }
  }, [id])

  useEffect(() => {
    if (id) {
      setConversation(null)
      axiosFetch({
        method: "get",
        url: `/api/conversations/${id}`,
        onSuccess(data) {
          setConversation(data)
        },
      })
    } else {
      setConversation(null)
    }
  }, [id])

  console.log(conversations)

  return (
    <div className="lg:flex border-x lg:border-x-2 w-full h-full min-h-screen">
      <div className="lg:hidden h-full w-full">
        {conversation ? (
          <>
            <Conversation initialConversation={conversation} socket={socket} />
          </>
        ) : (
          <>
            <div className="flex flex-col sticky top-16 sm:block sm:top-0 bg-white sm:bg-none border-b sm:border-none items-center gap-4 col-span-4 p-4">
              <div className="flex items-center justify-between w-full sm:mb-2">
                <span className=" sm:block font-bold text-3xl w-full">
                  Messages
                </span>
                <BsEnvelopePlus
                  // className="hidden sm:block"
                  onClick={() => showModal(<MessagesModal />)}
                  size={28}
                  color={"black"}
                />
              </div>
            </div>
            <div className="lg:hidden">
              <>
                {conversations && (
                  <ConversationsList
                    conversations={conversations}
                    setConversation={setConversation}
                  />
                )}
              </>
            </div>
          </>
        )}
      </div>
      <div className="hidden lg:flex w-full">
        <div className="w-2/5">
          <div className="flex flex-col sm:block sm:top-0 bg-white sm:bg-none border-b sm:border-none items-center gap-4 col-span-4 p-4">
            <div className="flex items-center justify-between w-full sm:mb-2">
              <span className="hidden sm:block font-bold text-3xl w-full">
                Messages
              </span>
              <BsEnvelopePlus
                onClick={() => showModal(<MessagesModal />)}
                className="hidden sm:block cursor-pointer"
                size={28}
                color={"black"}
              />
            </div>
          </div>
          {conversations && (
            <ConversationsList
              conversations={conversations}
              setConversation={setConversation}
            />
          )}
        </div>
        <div className="w-3/5">
          {conversation ? (
            <Conversation initialConversation={conversation} socket={socket} />
          ) : (
            <>
              <div className="flex flex-col justify-center items-center col-span-8 border-l h-screen w-full">
                <span className="font-bold text-3xl">Select a message</span>
                <span className="text-xl">
                  Choose from your existing conversations
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {!conversation && (
        <div className="sm:hidden fixed bottom-0 right-0 my-20 mr-2 bg-green-500 rounded-full z-50 p-2 text-white hover:cursor-pointer">
          <BsEnvelopePlus
            onClick={() => showModal(<MessagesModal />)}
            color="white"
            size={42}
          />
        </div>
      )}
    </div>
  )
}
