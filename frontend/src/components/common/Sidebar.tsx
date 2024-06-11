import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  FaHome,
  FaSearch,
  FaRegBell,
  FaCog,
  FaPencilAlt,
  FaTrophy,
  FaVolleyballBall,
} from "react-icons/fa"
import { FaRegMessage, FaRegUser } from "react-icons/fa6"

import { useAuth } from "../../contexts/AuthContext"
import { useModal } from "../../contexts/ModalContext"

import SidebarLink from "./SidebarLink"
import SidebarModal from "../mobile-modals/SidebarModal"
import PostModal from "../../modals/PostModal"

interface SidebarProps {
  notificationsCount: number | undefined
  messagesCount: number | undefined
}

export default function Sidebar({
  notificationsCount,
  messagesCount,
}: SidebarProps) {
  const { logout, currentUser } = useAuth()
  const [userDropdown, showUserDropdown] = useState(false)
  const navigate = useNavigate()
  const { showModal } = useModal()

  const handleAvatarClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault()
    showModal(<SidebarModal />)
  }

  return (
    <>
      <aside
        role="banner"
        className="fixed sm:w-2/12 flex justify-center xl:justify-start sm:relative bottom-0 w-full left-0 sm:top-0 shadow-[0_35px_60px_-15px_rgba(0,0,0,1)] sm:shadow-none p-2 bg-white max-h-screen sm:bg-none z-50"
      >
        <nav
          className="flex sm:fixed sm:top-0 sm:flex-col  xl:items-start sm:items-center sm:justify-between w-full sm:w-1/12 h-full z-40 sm:p-2"
          role="navigation"
        >
          <ul className="flex justify-between xl:items-start md:items-center w-full sm:flex-col sm:gap-8">
            <div className="hidden sm:block lg:hidden">
              <span
                className="hidden sm:block text-2xl xl:text-4xl font-bold cursor-pointer text-green-500"
                onClick={() => navigate("/dashboard")}
              >
                KT
              </span>
            </div>
            <span
              className="lg:block hidden text-3xl font-bold cursor-pointer text-green-500"
              onClick={() => navigate("/dashboard")}
            >
              KickTalk
            </span>
            <SidebarLink
              name="Home"
              to="/dashboard"
              icon={<FaHome size={25} />}
            />
            <SidebarLink
              name="Explore"
              to="/explore"
              icon={<FaSearch size={25} />}
            />
            <Link
              to={"/notifications"}
              className="grid grid-flow-col justify-start grid-cols-[1fr, auto] gap-5 cursor-pointer items-center p-3 rounded-3xl hover:bg-slate-50 transition-colors"
            >
              {notificationsCount ? (
                <>
                  <div className="relative">
                    <FaRegBell size={25} />
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {notificationsCount}
                    </span>
                  </div>

                  <a className="text-xl hidden xl:block">Notifications</a>
                </>
              ) : (
                <>
                  <FaRegBell size={25} />
                  <a className="xl:text-xl 2xl:text-2xl hidden xl:block">
                    Notifications
                  </a>
                </>
              )}
            </Link>
            <Link
              to={"/messages"}
              className="grid grid-flow-col justify-start grid-cols-[1fr, auto] gap-5 cursor-pointer items-center p-3 rounded-3xl hover:bg-slate-50 transition-colors"
            >
              {messagesCount ? (
                <>
                  <div className="relative">
                    <FaRegMessage size={25} />
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {messagesCount}
                    </span>
                  </div>

                  <a className="text-xl hidden xl:block">Messages</a>
                </>
              ) : (
                <>
                  <FaRegMessage size={25} />
                  <a className="xl:text-xl 2xl:text-2xl hidden xl:block">
                    Messages
                  </a>
                </>
              )}
            </Link>

            <SidebarLink
              name="Fixtures"
              to={`/fixtures/${currentUser?.team.id}`}
              icon={<FaVolleyballBall size={25} />}
            />
            <SidebarLink
              name="Standings"
              to={`/standings/${currentUser?.team.league}`}
              icon={<FaTrophy size={25} />}
            />
            <div className="hidden sm:block">
              <SidebarLink
                name="Settings"
                to="/settings/account"
                icon={<FaCog size={25} />}
              />
            </div>
            <div className="hidden sm:block">
              <SidebarLink
                name="Profile"
                to={`${currentUser?.username}`}
                icon={<FaRegUser size={25} />}
              />
            </div>

            <li className="hidden bg-green-500 text-white sm:grid grid-flow-col justify-start grid-cols-[1fr, auto] gap-5 cursor-pointer items-center p-3 rounded-3xl hover:bg-green-600 transition-colors">
              <div className="xl:hidden">
                <FaPencilAlt size={25} />
              </div>

              <a
                onClick={() => showModal(<PostModal />)}
                className="hidden xl:block text-xl"
              >
                Create Post
              </a>
            </li>
          </ul>
          <div className="hidden sm:block w-full">
            {userDropdown && (
              <div
                onMouseLeave={() => showUserDropdown(false)}
                className="absolute z-50 flex flex-col w-full bg-gray-50 justify-center rounded-3xl bottom-16 p-2 cursor-pointer"
              >
                <span onClick={() => logout()}>Log out</span>
              </div>
            )}
            <div
              onClick={() => showUserDropdown(true)}
              className="flex justify-between w-full text-sm gap-2 items-center cursor-pointer p-2 rounded-3xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img className="max-w-12 max-h-12" src={currentUser?.avatar} />
                <div className="hidden xl:flex xl:flex-col">
                  <span className="text-lg font-bold">
                    {currentUser?.displayName}
                  </span>
                  <span>@{currentUser?.username}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>
      <div className="fixed shadow-md sm:hidden h-16 top-0 left-0 w-full flex justify-between items-center bg-white sm:bg-none z-40 p-2">
        <div onClick={(e) => handleAvatarClick(e)}>
          <img
            className="w-10 hover:cursor-pointer"
            src={currentUser?.avatar}
          />
        </div>

        <span
          className="sm:hidden text-3xl font-bold cursor-pointer text-green-500"
          onClick={() => navigate("/dashboard")}
        >
          KickTalk
        </span>
        <SidebarLink
          name="Settings"
          to="/settings/account"
          icon={<FaCog size={25} />}
        />
      </div>
    </>
  )
}
