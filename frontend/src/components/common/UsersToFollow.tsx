import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useAxios from "../../hooks/useAxios"
import { useAuth } from "../../contexts/AuthContext"

export default function UsersToFollow() {
  const { axiosFetch } = useAxios()
  const { currentUser } = useAuth()
  const [suggestions, setSuggestions] = useState([])
  const [followingStatus, setFollowingStatus] = useState<any>({})

  useEffect(() => {
    if (currentUser) {
      axiosFetch({
        method: "get",
        url: `/api/users/suggestions/${currentUser.id}`,
        onSuccess: (data) => {
          setSuggestions(data)
          data.forEach((user: any) => {
            checkIfFollowing(user._id)
          })
        },
      })
    }
  }, [])

  const checkIfFollowing = (userId: any) => {
    axiosFetch({
      method: "post",
      url: `/api/users/check-following`,
      requestConfig: {
        data: {
          currentUserId: currentUser?.id,
          targetUserId: userId,
        },
      },
      onSuccess: (data) => {
        setFollowingStatus((prev: any) => ({
          ...prev,
          [userId]: data,
        }))
      },
    })
  }

  const followUser = (userId: any) => {
    axiosFetch({
      method: "post",
      url: "/api/users/follow",
      requestConfig: {
        data: {
          currentUserId: currentUser?.id,
          targetUserId: userId,
        },
      },
      onSuccess: () => {
        setFollowingStatus((prev: any) => ({
          ...prev,
          [userId]: true,
        }))
      },
    })
  }

  const unfollowUser = (userId: any) => {
    axiosFetch({
      method: "post",
      url: "/api/users/unfollow",
      requestConfig: {
        data: {
          currentUserId: currentUser?.id,
          targetUserId: userId,
        },
      },
      onSuccess: () => {
        setFollowingStatus((prev: any) => ({
          ...prev,
          [userId]: false,
        }))
      },
    })
  }

  return (
    <div className="sticky flex flex-col border-2 rounded-xl">
      <span className="font-bold text-3xl p-2">Users to Follow</span>
      <div className="flex flex-col gap-2">
        {suggestions.map((suggestion: any) => (
          <div
            key={suggestion._id}
            className="flex justify-between items-center hover:bg-gray-100 p-2"
          >
            <Link to={`/${suggestion.username}`} className="flex gap-4">
              <img
                src={suggestion.avatar}
                className="xl:w-16 xl:h-16 lg:w-10 lg:h-10 "
                alt="avatar"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl">
                  {suggestion.displayName}
                </span>
                <span>@{suggestion.username}</span>
              </div>
            </Link>
            {followingStatus[suggestion._id] ? (
              <span
                onClick={() => unfollowUser(suggestion._id)}
                className="cursor-pointer bg-green-500 text-white font-extrabold p-2 rounded-xl lg:text-lg xl:text-xl mr-2"
              >
                Following
              </span>
            ) : (
              <span
                onClick={() => followUser(suggestion._id)}
                className="cursor-pointer bg-blue-500 text-white font-extrabold p-2 rounded-xl text-xl mr-2"
              >
                Follow
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
