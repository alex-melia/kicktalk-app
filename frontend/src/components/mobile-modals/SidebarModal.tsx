import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"

import { FaBookmark, FaUser } from "react-icons/fa"
import useAxios from "../../hooks/useAxios"
import { useModal } from "../../contexts/ModalContext"

export default function SidebarModal() {
  const { hideModal } = useModal()
  const { logout, currentUser } = useAuth()
  const { axiosFetch } = useAxios()
  const [user, setUser] = useState<any>()

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/users/${currentUser?.username}`,
      onSuccess(data) {
        setUser(data)
      },
    })
  }, [currentUser])

  return (
    <div className="sm:hidden">
      <div
        onClick={hideModal}
        className="cursor-pointer fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-all duration-500"
      ></div>
      <div className="fixed top-0 left-0 bottom-0 w-4/5 bg-white z-50 ">
        <div className="flex flex-col w-full h-full p-8">
          <div className="flex flex-col gap-2 mb-8">
            <div className="relative">
              <img className="w-12" src={currentUser?.avatar} />
              <div
                onClick={() => {
                  logout()
                  hideModal()
                }}
                className="absolute top-0 right-0 bg-green-500 rounded-full p-2 text-white font-bold hover:cursor-pointer"
              >
                <span>Sign Out</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">
                {currentUser?.displayName}
              </span>
              <span className="text-sm">@{currentUser?.username}</span>
            </div>
            <div className="flex justify-between w-56">
              <span>{user?.followersCount} Followers</span>
              <span>{user?.followingCount} Following</span>
            </div>
          </div>
          <div className="border-y-2">
            <div className="flex flex-col justify-start gap-4 w-1/3 my-6">
              <a href={`/${currentUser?.username}`}>
                <div className="grid grid-cols-2 items-center">
                  <FaUser size={32} />
                  <span className="text-2xl font-bold">Profile</span>
                </div>
              </a>
              <div className="grid grid-cols-2 items-center">
                <FaBookmark size={32} />
                <span className="text-2xl font-bold">Bookmarks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
