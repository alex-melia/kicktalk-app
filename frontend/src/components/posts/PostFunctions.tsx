import { useState } from "react"
import {
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
  FaRetweet,
} from "react-icons/fa"
import { Post } from "../../types"
import useAxios from "../../hooks/useAxios"

import { useAuth } from "../../contexts/AuthContext"
import { useModal } from "../../contexts/ModalContext"
import ReplyModal from "../../modals/ReplyModal"

interface PostFunctionsProps {
  post: Post
}

export default function PostFunctions({ post }: PostFunctionsProps) {
  const { axiosFetch } = useAxios()
  const { currentUser } = useAuth()
  const { showModal } = useModal()

  const [isLiked, setIsLiked] = useState(
    currentUser && post.likedBy?.includes(currentUser?.id)
  )
  const [isReposted, setIsReposted] = useState(
    currentUser && post.repostedBy?.includes(currentUser?.id)
  )

  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [repostCount, setRepostCount] = useState(post.repostCount)

  const handleLike = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault()

    try {
      axiosFetch({
        method: "put",
        url: `/api/posts/${post._id}`,
        requestConfig: {
          data: {
            action: "like",
            contentType: post.postType,
            otherUserId: post.user._id,
            currentUserId: currentUser?.id,
          },
        },
        onSuccess(data) {
          setIsLiked(data.likedBy.includes(currentUser?.id))
          setLikeCount(data.likeCount)
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleReply = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault()
    showModal(<ReplyModal post={post} />)
  }

  const handleRepost = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault()

    try {
      axiosFetch({
        method: "put",
        url: `/api/posts/${post._id}`,
        requestConfig: {
          data: {
            action: "repost",
            contentType: post.postType,
            otherUserId: post.user._id,
            currentUserId: currentUser?.id,
          },
        },
        onSuccess(data) {
          setIsReposted(data.repostedBy.includes(currentUser?.id))
          setRepostCount(data.repostCount)
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex justify-between gap-2 mx-4">
      <div
        className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10 rounded-full p-1 transition z-10"
        onClick={(e) => handleReply(e)}
      >
        <FaRegComment className="cursor-pointer" size="18" />
        {post.replyCount > 0 && <span>{post.replyCount}</span>}
      </div>
      <div
        className="flex items-center gap-2 hover:text-green-500 hover:bg-green-500/10 rounded-full p-1 transition z-10"
        onClick={(e) => handleRepost(e)}
      >
        {isReposted ? (
          <FaRetweet className="cursor-pointer" size="18" color="green" />
        ) : (
          <FaRetweet className="cursor-pointer" size="18" />
        )}
        {repostCount > 0 && (
          <>
            {isReposted ? (
              <span className="text-green-500">{repostCount}</span>
            ) : (
              <span className="hover:text-green-500">{repostCount}</span>
            )}
          </>
        )}
      </div>
      <div
        className="flex items-center gap-2 hover:text-red-500 hover:bg-red-500/10 rounded-full p-1 transition z-10"
        onClick={(e) => handleLike(e)}
      >
        {isLiked ? (
          <FaHeart className="cursor-pointer" size="18" color="red" />
        ) : (
          <FaRegHeart className="cursor-pointer" size="18" />
        )}
        {likeCount > 0 && (
          <>
            {isLiked ? (
              <span className="text-red-500">{likeCount}</span>
            ) : (
              <span className="hover:text-red-500">{likeCount}</span>
            )}
          </>
        )}
      </div>
      <div
        className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10 rounded-full p-1 transition z-10"
        onClick={(e) => handleLike(e)}
      >
        <FaRegBookmark className="cursor-pointer" size="18" />
      </div>
    </div>
  )
}
