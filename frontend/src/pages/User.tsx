import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { HiArrowLeft } from "react-icons/hi2"
import { FaEnvelope } from "react-icons/fa"
import { BsThreeDots } from "react-icons/bs"
import useAxios from "../hooks/useAxios"

import { useAuth } from "../contexts/AuthContext"
import { useModal } from "../contexts/ModalContext"

import PostList from "../components/posts/PostList"
import EditProfile from "../components/modals/EditProfile"
import ReplyList from "../components/posts/ReplyList"
import Loading from "../components/common/Loading"
import { User as TUser } from "../types"
import NotFound from "./NotFound"

export default function User() {
  const { username } = useParams()
  const { loading, axiosFetch } = useAxios()
  const { currentUser } = useAuth()

  const location = useLocation()

  const [user, setUser] = useState<TUser>()
  const [userPosts, setUserPosts] = useState<any>([])
  const [postType, setPostType] = useState("")
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  const navigate = useNavigate()

  const { showModal } = useModal()

  useEffect(() => {
    const pathSegments = location.pathname.split("/")

    if (pathSegments.includes("replies")) {
      setPostType("reply")
    } else if (pathSegments.includes("media")) {
      setPostType("media")
    } else if (pathSegments.includes("likes")) {
      setPostType("likes")
    } else {
      setPostType("post")
    }
  }, [location])

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/posts/byuser/${username}?postType=${postType}`,
      onSuccess(data) {
        setUserPosts(data)
      },
    })
  }, [postType])

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/users/${username}`,
      onSuccess(data) {
        setUser(data)
      },
    })
  }, [username])

  useEffect(() => {
    if (username) {
      axiosFetch({
        method: "post",
        url: "/api/users/check-following",
        requestConfig: {
          data: {
            currentUserId: currentUser?.id,
            targetUserId: user?._id,
          },
        },
        onSuccess(data) {
          setIsFollowing(data)
        },
      })
    }
  }, [username, user])

  const handleEditProfileClick = () => {
    showModal(<EditProfile />)
  }

  const followUser = (userId: string | undefined) => {
    axiosFetch({
      method: "post",
      url: "/api/users/follow",
      requestConfig: {
        data: {
          currentUserId: currentUser?.id,
          targetUserId: userId,
        },
      },
      onSuccess(data) {
        setIsFollowing(data)
      },
    })
  }

  const unfollowUser = (userId: string | undefined) => {
    axiosFetch({
      method: "post",
      url: "/api/users/unfollow",
      requestConfig: {
        data: {
          currentUserId: currentUser?.id,
          targetUserId: userId,
        },
      },
      onSuccess(data) {
        setIsFollowing(data)
      },
    })
  }

  const createConversation = (userId: string | undefined) => {
    axiosFetch({
      method: "post",
      url: "/api/conversations",
      requestConfig: {
        data: {
          currentUserId: currentUser?.id,
          targetUserId: userId,
          isRequested: true,
          requestedBy: currentUser?.id,
        },
      },
      onSuccess(data) {
        navigate(`/messages/${data}`)
      },
    })
  }

  return (
    <>
      {loading ? (
        <>
          <div className="flex justify-center w-full">
            <Loading />
          </div>
        </>
      ) : (
        <>
          {user ? (
            <div className="flex flex-col border-x-2 min-h-screen w-full">
              <div className="flex w-full items-center p-2 gap-4 sticky top-16 sm:top-0 bg-white z-30">
                <HiArrowLeft
                  className="hover:cursor-pointer"
                  size={32}
                  onClick={() => navigate(-1)}
                />
                <div className="flex flex-col">
                  <span className="font-bold text-2xl">
                    {user?.displayName}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="items-stretch cursor-pointer">
                  <div className="block bg-black z-10 w-full h-56"></div>
                </div>
                <div className="relative h-14">
                  <div className="absolute transform -translate-y-1/2 left-4 h-32 w-32 rounded-full bg-blue-400 flex justify-center items-center z-20">
                    <img src={user?.avatar} className="w-full" />
                  </div>
                  <div className="absolute right-1 p-4 flex items-center gap-2">
                    {currentUser?.id !== user?._id ? (
                      <>
                        <span className="p-3 bg-green-500 rounded-3xl hover:cursor-pointer">
                          <BsThreeDots size={24} color={"white"} />
                        </span>
                        <span
                          className="p-3 bg-green-500 rounded-3xl hover:cursor-pointer"
                          onClick={() => createConversation(user?._id)}
                        >
                          <FaEnvelope size={24} color={"white"} />
                        </span>
                        {isFollowing ? (
                          <span
                            className="bg-green-500 text-white text-2xl font-bold p-2 rounded-3xl hover:cursor-pointer hover:bg-red-500"
                            onClick={() => unfollowUser(user?._id)}
                          >
                            Following
                          </span>
                        ) : (
                          <span
                            className="bg-green-500 text-white text-2xl font-bold rounded-3xl p-2 hover:cursor-pointer"
                            onClick={() => followUser(user?._id)}
                          >
                            Follow
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span
                          className="p-3 bg-green-500 rounded-3xl text-xl hover:cursor-pointer text-white font-bold"
                          onClick={handleEditProfileClick}
                        >
                          Edit Profile
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col p-4">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold">
                          {user?.displayName}
                        </span>
                        <span>@{user?.username}</span>
                      </div>
                      <span>{user?.bio}</span>
                      <div className="flex gap-4">
                        <div className="flex gap-2 items-center text-xl">
                          <span className="font-bold">
                            {user?.followingCount}
                          </span>
                          <span>Following</span>
                        </div>
                        <div className="flex gap-2 items-center text-xl">
                          <span className="font-bold">
                            {user?.followersCount}
                          </span>
                          <span>Followers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 border-b">
                  <Link to={`/${user?.username}`}>
                    <div className="flex justify-center p-4 hover:bg-gray-100 cursor-pointer transition">
                      <span className="font-bold">Posts</span>
                    </div>
                  </Link>
                  <Link to={`/${user?.username}/replies`}>
                    <div className="flex justify-center p-4 hover:bg-gray-100 cursor-pointer transition">
                      <span className="font-bold">Replies</span>
                    </div>
                  </Link>
                  <Link to={`/${user?.username}/media`}>
                    <div className="flex justify-center p-4 hover:bg-gray-100 cursor-pointer transition">
                      <span className="font-bold">Media</span>
                    </div>
                  </Link>
                  <Link to={`/${user?.username}/likes`}>
                    <div className="flex justify-center p-4 hover:bg-gray-100 cursor-pointer transition">
                      <span className="font-bold">Likes</span>
                    </div>
                  </Link>
                </div>
              </div>

              {postType === "reply" && <ReplyList posts={userPosts} />}
              {postType === "media" && <PostList posts={userPosts} />}
              {postType === "post" && <PostList posts={userPosts} />}
              {postType === "likes" && <PostList posts={userPosts} />}
            </div>
          ) : (
            <NotFound />
          )}
        </>
      )}
    </>
  )
}
