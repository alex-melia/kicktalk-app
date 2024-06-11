import { User } from "../../types"

interface PostPopupProps {
  user: User
}

export default function PostPopup({ user }: PostPopupProps) {
  return (
    <div className="hidden sm:block absolute w-64 rounded-lg border-1 shadow-xl z-50 p-2 bg-gray-400 left-1/2 transform -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300 delay-300">
      <div className="flex flex-col justify-center">
        <img className="w-20" src={user.avatar} />
        <span>{user.displayName}</span>
        <span className="text-gray-100">@{user.username}</span>
      </div>
    </div>
  )
}
