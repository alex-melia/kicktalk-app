import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2"
import { useModal } from "../contexts/ModalContext"
import { useEffect, useState } from "react"
import useAxios from "../hooks/useAxios"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { User } from "../types"

export default function MessagesModal() {
  const { hideModal } = useModal()
  const { currentUser } = useAuth()
  const { axiosFetch } = useAxios()
  const [query, setQuery] = useState<string | undefined>("")
  const [users, setUsers] = useState<User[] | null>()

  const navigate = useNavigate()

  useEffect(() => {
    if (query) {
      axiosFetch({
        method: "get",
        url: `/api/users/search?query=${query}`,
        onSuccess: (data) => {
          setUsers(data)
        },
      })
    }
  }, [query])

  const createConversation = (userId: string | undefined) => {
    axiosFetch({
      method: "post",
      url: "/api/conversations",
      requestConfig: {
        data: {
          currentUserId: currentUser?.id,
          targetUserId: userId,
        },
      },
      onSuccess(data) {
        navigate(`/messages/${data}`)
        hideModal()
      },
    })
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-100/50 z-50 flex justify-center z-50"
        onClick={hideModal}
      ></div>
      <div className="fixed flex flex-col gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 sm:w-1/5 h-1/2 bg-white z-50 rounded-xl shadow-md border">
        <div className="flex items-center justify-between p-2">
          <div className="flex gap-4">
            <HiXMark onClick={hideModal} size={32} />
            <span className="text-2xl font-extrabold">New Message</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-green-500 p-2 mx-2 rounded-xl text-white font-bold">
          <HiMagnifyingGlass size={24} />
          <input
            id="query"
            className="text-lg bg-green-500 text-white font-bold"
            placeholder="Search for people"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col overflow-y-scroll h-full">
          {users?.map((user, index) => (
            <div
              key={index}
              onClick={() => createConversation(user._id)}
              className="flex items-center gap-2 w-full hover:bg-gray-100 cursor-pointer p-2"
            >
              <img className="w-12" src={user.avatar} />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl">
                  {user.displayName}
                </span>
                <span>@{user.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
