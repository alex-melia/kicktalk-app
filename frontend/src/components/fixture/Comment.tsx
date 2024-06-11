import { HiArrowDown, HiArrowUp } from "react-icons/hi2"
import formatTimestamp from "../../utils/formatTimestamp"
import useAxios from "../../hooks/useAxios"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Comment as IComment } from "../../types/shared"

interface CommentProps {
  initialComment: IComment
}

export default function Comment({ initialComment }: CommentProps) {
  const { axiosFetch } = useAxios()
  const { currentUser } = useAuth()

  const [comment, setComment] = useState<IComment>(initialComment)
  const [isUpvoted, setIsUpvoted] = useState(
    currentUser && comment.upvotes.includes(currentUser?.id)
  )
  const [isDownvoted, setIsDownvoted] = useState(
    currentUser && comment.downvotes.includes(currentUser?.id)
  )

  const upvoteComment = async () => {
    if (!isUpvoted) {
      axiosFetch({
        method: "put",
        url: `/api/comments/upvote/${comment._id}`,
        requestConfig: {
          data: {
            type: "add",
            userId: currentUser?.id,
          },
        },
        onSuccess: (data) => {
          setIsUpvoted(true)
          setIsDownvoted(false)
          setComment(data)
        },
      })
    } else {
      axiosFetch({
        method: "put",
        url: `/api/comments/upvote/${comment._id}`,
        requestConfig: {
          data: {
            type: "remove",
            userId: currentUser?.id,
          },
        },
        onSuccess: (data) => {
          setIsUpvoted(false)
          setComment(data)
        },
      })
    }
  }

  const downvoteComment = async () => {
    if (!isDownvoted) {
      axiosFetch({
        method: "put",
        url: `/api/comments/downvote/${comment._id}`,
        requestConfig: {
          data: {
            type: "add",
            userId: currentUser?.id,
          },
        },
        onSuccess: (data) => {
          setIsDownvoted(true)
          setIsUpvoted(false)
          setComment(data)
        },
      })
    } else {
      axiosFetch({
        method: "put",
        url: `/api/comments/downvote/${comment._id}`,
        requestConfig: {
          data: {
            type: "remove",
            userId: currentUser?.id,
          },
        },
        onSuccess: (data) => {
          setIsDownvoted(false)
          setComment(data)
        },
      })
    }
  }

  return (
    <div className="w-full flex flex-col gap-2 bg-gray-100 p-2 rounded-xl">
      <div className="flex items-center gap-2">
        <img className="w-12" src={comment.user.avatar} />
        <div className="flex items-center gap-1">
          <span className="font-bold text-lg">{comment.user.displayName}</span>
          <span className="text-sm">@{comment.user.username}</span>
          <span className="text-sm">-</span>
          <span className="text-sm">{formatTimestamp(comment.createdAt)}</span>
        </div>
      </div>
      {comment.content}
      <div className="flex items-center gap-2">
        <HiArrowUp
          onClick={() => upvoteComment()}
          className={`hover:cursor-pointer ${
            isUpvoted ? "text-green-500" : ""
          }`}
          size={18}
        />
        <span
          className={`hover:cursor-pointer ${
            isUpvoted ? "text-green-500" : ""
          } ${isDownvoted ? "text-red-500" : ""}`}
        >
          {comment.voteCount}
        </span>
        <HiArrowDown
          onClick={() => downvoteComment()}
          className={`hover:cursor-pointer ${
            isDownvoted ? "text-red-500" : ""
          }`}
          size={18}
        />
      </div>
    </div>
  )
}
