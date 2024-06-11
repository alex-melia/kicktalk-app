import { HiArrowLeft, HiArrowRight } from "react-icons/hi2"
import { Link, useNavigate } from "react-router-dom"
import { CurrentUser } from "../../types"

interface UserDataProps {
  // user: User
  user: CurrentUser
}

export default function UserData({ user }: UserDataProps) {
  const navigate = useNavigate()
  return (
    <>
      <div className="flex items-center mx-4 gap-4">
        <Link
          to={"/settings/account"}
          className="hover:bg-gray-100 hover:cursor-pointer rounded-3xl p-2 font-bold transition ease-in-out"
        >
          <HiArrowLeft size={32} />
        </Link>
        <span className="font-bold text-3xl p-4">Account information</span>
      </div>
      <div className="border-b">
        <div
          onClick={() => navigate("/settings/username")}
          className="flex justify-between items-center hover:bg-gray-100 hover:cursor-pointer p-4"
        >
          <div className="flex flex-col">
            <span className="text-xl font-bold">Username</span>
            <span>@{user.username}</span>
          </div>
          <HiArrowRight size={24} />
        </div>
        <div
          onClick={() => navigate("/settings/email")}
          className="flex justify-between items-center hover:bg-gray-100 hover:cursor-pointer p-4"
        >
          <div className="flex flex-col">
            <span className="text-xl font-bold">Email</span>
            <span>{user.email}</span>
          </div>
          <HiArrowRight size={24} />
        </div>
      </div>
      <div className="border-b">
        <div className="flex justify-between items-center hover:bg-gray-100 hover:cursor-pointer p-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold">Date created</span>
            <span>@{user.username}</span>
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="flex justify-between items-center hover:bg-gray-100 hover:cursor-pointer p-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold">Country</span>
            <span>United Kingdom</span>
          </div>
        </div>
        <div className="flex justify-between items-center hover:bg-gray-100 hover:cursor-pointer p-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold">Gender</span>
            <span>Male</span>
          </div>
        </div>
        <div className="flex justify-between items-center hover:bg-gray-100 hover:cursor-pointer p-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold">Birth date</span>
            <span>Apr 19, 2002</span>
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="flex justify-between items-center hover:bg-gray-100 hover:cursor-pointer p-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold">Age</span>
            <span>21</span>
          </div>
        </div>
      </div>
    </>
  )
}
