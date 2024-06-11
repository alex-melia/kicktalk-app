import { Outlet, useLocation } from "react-router-dom"

import Footer from "../components/common/Footer"
import Navbar from "../components/navbar/Navbar"
import Sidebar from "../components/common/Sidebar"

import { useAuth } from "../contexts/AuthContext"
import { useEffect, useState } from "react"
import useAxios from "../hooks/useAxios"

export default function AppLayout() {
  const location = useLocation()
  const { currentUser } = useAuth()
  const { axiosFetch } = useAxios()

  const [notificationsCount, setNotificationsCount] = useState()
  const [messagesCount, setMessagesCount] = useState()

  useEffect(() => {
    if (currentUser?.id) {
      axiosFetch({
        method: "get",
        url: `/api/notifications/count/${currentUser.id}`,
        onSuccess(data) {
          setNotificationsCount(data)
        },
      })

      axiosFetch({
        method: "get",
        url: `/api/messages/count/${currentUser.id}`,
        onSuccess(data) {
          setMessagesCount(data)
        },
      })
    }
  }, [currentUser?.id, location])

  return !currentUser ? (
    <div className="h-screen">
      <Navbar />
      <main className="w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : (
    <div className="flex justify-center w-full min-h-screen">
      <div className="xl:w-[1650px] lg:w-[1280px] md:w-[768px] w-full h-full">
        <div className="flex w-full min-h-screen">
          <Sidebar
            notificationsCount={notificationsCount}
            messagesCount={messagesCount}
          />

          <main className="flex grow w-full h-full sm:w-10/12 sm:justify-start my-16 sm:my-0">
            <Outlet context={currentUser} />
          </main>
        </div>
      </div>
    </div>
  )
}
