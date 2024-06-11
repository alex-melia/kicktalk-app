import { Link, redirect, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineKey,
  HiOutlineUser,
  HiXMark,
} from "react-icons/hi2"
import useAxios from "../hooks/useAxios"

import UserData from "../components/settings/UserData"
import NotificationsOptions from "../components/settings/NotificationsOptions"
import { FormEvent, useState } from "react"
import AccessibilityOptions from "../components/settings/AccessibilityOptions"

export default function Settings() {
  const { type } = useParams()
  const { option } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { axiosFetch } = useAxios()

  const [username, setUsername] = useState(currentUser?.username)
  const [email, setEmail] = useState(currentUser?.email)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPasword] = useState("")

  if (!currentUser) {
    redirect("/")
  }

  console.log(option)

  function renderOptionContent(option: string | undefined) {
    switch (option) {
      case "your_data":
        return <>{currentUser && <UserData user={currentUser} />}</>
      case "notifications":
        return <NotificationsOptions />
      default:
        return null
    }
  }

  function changeUsername(e: FormEvent) {
    e.preventDefault()
    axiosFetch({
      method: "put",
      url: `/api/users/${currentUser?.id}`,
      requestConfig: {
        data: {
          data: username,
          type: "username",
        },
      },
      onSuccess: () => {
        window.location.reload()
      },
    })
  }

  function changePassword(e: FormEvent) {
    e.preventDefault()

    if (newPassword === confirmPassword) {
      axiosFetch({
        method: "put",
        url: `/api/auth/change-password/${currentUser?.id}`,
        requestConfig: {
          data: {
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          },
        },
        onSuccess: () => {
          window.location.reload()
        },
      })
    }
  }

  function changeEmail(e: FormEvent) {
    e.preventDefault()
    axiosFetch({
      method: "put",
      url: `/api/users/${currentUser?.id}`,
      requestConfig: {
        data: {
          data: email,
          type: "email",
        },
      },
      onSuccess: () => {
        window.location.reload()
      },
    })
  }

  return (
    <>
      <div className="lg:hidden w-full h-full border-x-2 h-full min-h-screen">
        {option ? (
          renderOptionContent(option)
        ) : type ? (
          <>
            {type === "account" && option === undefined && (
              <>
                <div className="sticky top-16 sm:top-0 w-full flex p-2 gap-4 items-center bg-white border-b-2">
                  <HiArrowLeft
                    className="hover:cursor-pointer"
                    size={32}
                    onClick={() => navigate(-1)}
                  />
                  <span className="font-bold text-2xl">Your Account</span>
                </div>
                {/* <span className="font-bold text-3xl p-4">Your Account</span> */}
                <div className="flex flex-col gap-4">
                  <Link
                    to={"/settings/your_data/account"}
                    className="flex justify-between hover:bg-gray-100 hover:cursor-pointer items-center items-center p-2"
                  >
                    <div className="flex items-center">
                      <HiOutlineUser className="mx-6" size={24} />
                      <div className="flex flex-col">
                        <span className="font-bold text-xl">
                          Account information
                        </span>
                        <span className="text-md">
                          See your account information like your username and
                          email address.
                        </span>
                      </div>
                    </div>
                    <HiArrowRight size={24} />
                  </Link>
                  <div
                    onClick={() => navigate("/settings/password")}
                    className="flex justify-between hover:bg-gray-100 hover:cursor-pointer items-center items-center p-2"
                  >
                    <div className="flex items-center">
                      <HiOutlineKey className="mx-6" size={24} />
                      <div className="flex flex-col">
                        <span className="font-bold text-xl">
                          Change your password
                        </span>
                        <span className="text-md">
                          Change your password at any time
                        </span>
                      </div>
                    </div>
                    <HiArrowRight size={24} />
                  </div>
                  <div className="flex justify-between hover:bg-gray-100 hover:cursor-pointer items-center items-center p-2">
                    <div className="flex items-center">
                      <HiXMark className="mx-6" size={24} />
                      <div className="flex flex-col">
                        <span className="font-bold text-xl">
                          Deactivate your account
                        </span>
                        <span className="text-md">
                          Find out how you can deactivate your account
                        </span>
                      </div>
                    </div>
                    <HiArrowRight size={24} />
                  </div>
                </div>
              </>
            )}
            {type === "password" && option === undefined && (
              <>
                <div className="flex items-center p-4 gap-4 border-b">
                  <HiArrowLeft
                    className="hover:cursor-pointer"
                    size={24}
                    onClick={() => navigate(-1)}
                  />
                  <span className="font-bold text-2xl">Change password</span>
                </div>
                <form
                  className="flex flex-col p-2 gap-1"
                  onSubmit={changePassword}
                >
                  <label htmlFor="password" className="text-2xl">
                    Current Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="border p-2 rounded-lg text-xl"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    value={currentPassword}
                  />
                  <label htmlFor="password" className="text-2xl">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="border p-2 rounded-lg text-xl"
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                  />
                  <label htmlFor="password" className="text-2xl">
                    Confirm Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="border p-2 rounded-lg text-xl"
                    onChange={(e) => setConfirmPasword(e.target.value)}
                    value={confirmPassword}
                  />
                  <button className="flex items-center justify-center w-16 p-1 bg-green-500 rounded-3xl items-center font-bold text-white text-xl">
                    Save
                  </button>
                </form>
              </>
            )}

            {type === "notifications" && <NotificationsOptions />}
            {type === "accessibility" && (
              <span className="font-bold text-3xl">Accessibility</span>
            )}
          </>
        ) : (
          <div className="flex flex-col sticky top-16 sm:block sm:top-0 bg-white sm:bg-none border-b sm:border-none items-center gap-4 col-span-4">
            <span className="p-2 font-bold text-2xl">Settings</span>

            <div className="flex flex-col justify-between w-full sm:mb-2">
              <div className="flex flex-col">
                <Link
                  to={"/settings/account"}
                  className={`${
                    type === "account" ? "bg-gray-100" : ""
                  } flex hover:bg-gray-100 hover:cursor-pointer justify-between items-center p-2`}
                >
                  <span className="text-xl">Your account</span>
                  <HiArrowRight size={24} />
                </Link>
                <Link
                  to={"/settings/notifications"}
                  className={`${
                    type === "notifications" ? "bg-gray-100" : ""
                  } flex hover:bg-gray-100 hover:cursor-pointer justify-between items-center p-2`}
                >
                  <span className="text-xl">Notifications</span>
                  <HiArrowRight size={24} />
                </Link>
                <Link
                  to={"/settings/accessibility"}
                  className={`${
                    type === "accessibility" ? "bg-gray-100" : ""
                  } flex hover:bg-gray-100 hover:cursor-pointer justify-between items-center p-2`}
                >
                  <span className="text-xl">Accessibility</span>
                  <HiArrowRight size={24} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="hidden lg:flex w-full">
        <div className="w-2/5 col-span-5 flex flex-col border h-screen">
          <span className="font-bold text-3xl p-4">Settings</span>
          <div className="flex flex-col">
            <Link
              to={"/settings/account"}
              className={`${
                type === "account" ? "bg-gray-100" : ""
              } flex hover:bg-gray-100 hover:cursor-pointer justify-between items-center p-2`}
            >
              <span className="text-xl">Your account</span>
              <HiArrowRight size={24} />
            </Link>
            <Link
              to={"/settings/notifications"}
              className={`${
                type === "notifications" ? "bg-gray-100" : ""
              } flex hover:bg-gray-100 hover:cursor-pointer justify-between items-center p-2`}
            >
              <span className="text-xl">Notifications</span>
              <HiArrowRight size={24} />
            </Link>
            <Link
              to={"/settings/accessibility"}
              className={`${
                type === "accessibility" ? "bg-gray-100" : ""
              } flex hover:bg-gray-100 hover:cursor-pointer justify-between items-center p-2`}
            >
              <span className="text-xl">Accessibility</span>
              <HiArrowRight size={24} />
            </Link>
          </div>
        </div>
        <div className="w-3/5 flex flex-col border h-screen">
          <>
            {type === "account" && option === undefined ? (
              <>
                <span className="font-bold text-3xl mb-4 p-4">
                  Your Account
                </span>
                <span className="text-lg mb-6 mx-6">
                  See information about your account
                </span>
                <div className="flex flex-col gap-4">
                  <Link
                    to={"/settings/your_data/account"}
                    className="flex justify-between hover:bg-gray-100 hover:cursor-pointer items-center items-center p-2"
                  >
                    <div className="flex items-center">
                      <HiOutlineUser className="mx-6" size={24} />
                      <div className="flex flex-col">
                        <span className="font-bold text-xl">
                          Account information
                        </span>
                        <span className="text-md">
                          See your account information like your username and
                          email address.
                        </span>
                      </div>
                    </div>
                    <HiArrowRight size={24} />
                  </Link>
                  <div
                    onClick={() => navigate("/settings/password")}
                    className="flex justify-between hover:bg-gray-100 hover:cursor-pointer items-center items-center p-2"
                  >
                    <div className="flex items-center">
                      <HiOutlineKey className="mx-6" size={24} />
                      <div className="flex flex-col">
                        <span className="font-bold text-xl">
                          Change your password
                        </span>
                        <span className="text-md">
                          Change your password at any time
                        </span>
                      </div>
                    </div>
                    <HiArrowRight size={24} />
                  </div>
                  <div className="flex justify-between hover:bg-gray-100 hover:cursor-pointer items-center items-center p-2">
                    <div className="flex items-center">
                      <HiXMark className="mx-6" size={24} />
                      <div className="flex flex-col">
                        <span className="font-bold text-xl">
                          Deactivate your account
                        </span>
                        <span className="text-md">
                          Find out how you can deactivate your account
                        </span>
                      </div>
                    </div>
                    <HiArrowRight size={24} />
                  </div>
                </div>
              </>
            ) : (
              renderOptionContent(option)
            )}
          </>

          {type === "notifications" && <NotificationsOptions />}

          {type === "accessibility" && <AccessibilityOptions />}
          {type === "username" && (
            <>
              <div className="flex items-center p-4 gap-4 border-b">
                <HiArrowLeft
                  className="hover:cursor-pointer"
                  size={32}
                  onClick={() => navigate(-1)}
                />
                <span className="font-bold text-3xl">Change username</span>
              </div>
              <form
                className="flex flex-col p-2 gap-1"
                onSubmit={changeUsername}
              >
                <label htmlFor="username" className="text-2xl">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="border p-2 rounded-lg text-xl"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
                <button className="flex items-center justify-center w-16 p-1 bg-green-500 rounded-3xl items-center font-bold text-white text-xl">
                  Save
                </button>
              </form>
            </>
          )}
          {type === "email" && (
            <>
              <div className="flex items-center p-4 gap-4 border-b">
                <HiArrowLeft
                  className="hover:cursor-pointer"
                  size={32}
                  onClick={() => navigate(-1)}
                />
                <span className="font-bold text-3xl">Change email</span>
              </div>
              <form className="flex flex-col p-2 gap-1" onSubmit={changeEmail}>
                <label htmlFor="email" className="text-2xl">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  className="border p-2 rounded-lg text-xl"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <button className="flex items-center justify-center w-16 p-1 bg-green-500 rounded-3xl items-center font-bold text-white text-xl">
                  Save
                </button>
              </form>
            </>
          )}
          {type === "password" && (
            <>
              <div className="flex items-center p-4 gap-4 border-b">
                <HiArrowLeft
                  className="hover:cursor-pointer"
                  size={32}
                  onClick={() => navigate(-1)}
                />
                <span className="font-bold text-3xl">Change password</span>
              </div>
              <form
                className="flex flex-col p-2 gap-1"
                onSubmit={changePassword}
              >
                <label htmlFor="password" className="text-2xl">
                  Current Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="border p-2 rounded-lg text-xl"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  value={currentPassword}
                />
                <label htmlFor="password" className="text-2xl">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="border p-2 rounded-lg text-xl"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
                <label htmlFor="password" className="text-2xl">
                  Confirm Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="border p-2 rounded-lg text-xl"
                  onChange={(e) => setConfirmPasword(e.target.value)}
                  value={confirmPassword}
                />
                <button className="flex items-center justify-center w-16 p-1 bg-green-500 rounded-3xl items-center font-bold text-white text-xl">
                  Save
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}
