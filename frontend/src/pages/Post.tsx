import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { HiArrowLeft } from "react-icons/hi2"
import { Post as TPost } from "../types"
import useAxios from "../hooks/useAxios"

import PostPopup from "../components/posts/PostPopup"
import PostCard from "../components/posts/PostCard"
import PostList from "../components/posts/PostList"
import PostFunctions from "../components/posts/PostFunctions"
import ReplyForm from "../components/posts/ReplyForm"

interface PostData {
  isLiked: boolean
  post: TPost
  replies: Array<TPost>
}

export default function Post() {
  const { axiosFetch } = useAxios()
  const { postId } = useParams()

  const [post, setPost] = useState<PostData>()

  const navigate = useNavigate()

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/posts/${postId}`,
      onSuccess(data) {
        setPost(data)
      },
    })
  }, [postId])

  const mediaContent =
    post?.post.media && post.post.media.length > 1 ? (
      <div className="grid grid-cols-2 gap-2">
        {Array.isArray(post.post.media) &&
          post.post.media.map((media: string, i: number) => (
            <img key={i} className="w-full" src={media} alt={`Media ${i}`} />
          ))}
      </div>
    ) : (
      <div className="flex justify-center">
        <img className="w-1/2" src={post?.post.media} />
      </div>
    )

  const handleNewReply = (newReply: any) => {
    if (post && newReply) {
      setPost((prevPost: any) => ({
        ...prevPost,
        replies: [...prevPost.replies, newReply],
      }))
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return { timeString: "", dateStringFormatted: "" }

    const date = new Date(dateString)
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }

    const timeString = date.toLocaleString("en-US", timeOptions)
    const dateStringFormatted = date.toLocaleString("en-US", dateOptions)

    return { timeString, dateStringFormatted }
  }

  const { timeString, dateStringFormatted } = post
    ? formatDate(post.post.createdAt)
    : { timeString: "", dateStringFormatted: "" }

  console.log(post?.replies)

  return (
    <div className="w-full h-full border-x-2 min-h-screen">
      <div className="flex sticky top-16 sm:top-0 bg-white w-full items-center p-3 gap-4 border-b-2 z-30">
        <HiArrowLeft
          className="hover:cursor-pointer"
          size={24}
          onClick={() => navigate(-1)}
        />
        <div className="flex flex-col">
          <span className="font-bold text-2xl">Post</span>
        </div>
      </div>
      {post?.post.replyingTo && (
        <div className="flex gap-2 p-2">
          <PostCard post={post?.post.replyingTo} />
        </div>
      )}
      {post && (
        <div className="flex flex-col" key={post.post._id}>
          <div className="flex gap-2 p-2">
            <div className="relative group">
              {post.post.user && (
                <img className="w-12 h-12" src={post.post.user.avatar} />
              )}
            </div>
            <PostPopup user={post.post.user} />
            <span className="relative group font-bold text-lg hover:underline inline-block">
              <div className="flex flex-col">
                {post.post.user.displayName}
                <PostPopup user={post.post.user} />
                <a className="text-sm" href={`/${post.post.user.username}`}>
                  @{post.post.user.username}
                </a>
              </div>
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="p-2">{post.post.content}</span>
            {mediaContent}
            <div className="flex items-center gap">
              <span className="p-2">{timeString}</span>
              <span>-</span>
              <span className="p-2">{dateStringFormatted}</span>
            </div>
            <div className="border-y-2 p-2 mx-4">
              <PostFunctions post={post.post} />
            </div>
            <div className="flex border-b-2 gap-4 p-2 py-6">
              {post && <ReplyForm post={post} onReplyPosted={handleNewReply} />}
            </div>
          </div>
          <PostList posts={post.replies} />
        </div>
      )}
    </div>
  )
}
