import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { HiArrowLeft } from "react-icons/hi2"

import { useAuth } from "../contexts/AuthContext"
import useAxios from "../hooks/useAxios"
import NotificationsList from "../components/notifications/NotificationsList"
import SideComponents from "../components/common/SideComponents"
import { Notification } from "../types/shared"

export default function Notifications() {
  const { currentUser } = useAuth()
  const { axiosFetch } = useAxios()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<Notification[]>()

  useEffect(() => {
    if (currentUser?.id) {
      axiosFetch({
        method: "get",
        url: `/api/notifications/${currentUser?.id}`,
        onSuccess(data) {
          setNotifications(data)
        },
      })

      axiosFetch({
        method: "post",
        url: `/api/notifications/read/${currentUser?.id}`,
      })
    }
  }, [currentUser?.id])

  return (
    <div className="md:flex w-full gap-4 h-screen">
      <div className="border-x-2 w-full h-full lg:w-8/12">
        <div className="sticky top-16 sm:top-0 w-full flex p-2 gap-4 items-center bg-white border-b-2">
          <HiArrowLeft
            className="hover:cursor-pointer"
            size={32}
            onClick={() => navigate(-1)}
          />
          <span className="font-bold text-2xl">Notifications</span>
        </div>
        <div className="flex flex-col">
          {notifications && notifications.length ? (
            <>
              <NotificationsList notifications={notifications} />
            </>
          ) : (
            <div className="flex justify-center items-center w-full mt-24">
              <span className="text-xl font-bold">You're all caught up!</span>
            </div>
          )}
        </div>
      </div>
      <SideComponents />
    </div>
  )
}
