import { useModal } from "../contexts/ModalContext"
import { HiXMark } from "react-icons/hi2"
import formatTimestamp from "../utils/formatTimestamp"
import { useAuth } from "../contexts/AuthContext"
import { useRef } from "react"
import useAxios from "../hooks/useAxios"
import { Post } from "../types"

interface ReplyModalProps {
  post: Post
}

export default function ReplyModal({ post }: ReplyModalProps) {
  const { hideModal } = useModal()
  const { currentUser } = useAuth()
  const { axiosFetch } = useAxios()
  const replyContentRef = useRef<HTMLSpanElement>(null)

  const handleReply = async (post: any) => {
    if (replyContentRef.current) {
      const replyContent = replyContentRef.current.innerText

      if (!replyContent.trim()) {
        alert("Please enter a reply.")
        return
      }

      axiosFetch({
        method: "put",
        url: `/api/posts/${post._id}`,
        requestConfig: {
          data: {
            action: "reply",
          },
        },
      })

      await axiosFetch({
        method: "post",
        url: "/api/posts/create",
        requestConfig: {
          data: {
            postType: "reply",
            replyingTo: post._id,
            content: replyContent,
            user: currentUser?.id,
          },
        },
        onSuccess: () => hideModal(),
      })
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-100/50 z-30 flex justify-center"
        onClick={hideModal}
      ></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white z-40 w-1/4 h-1/3 rounded-xl p-2">
        <HiXMark className="cursor-pointer" onClick={hideModal} size={38} />
        <div className="flex gap-2 p-2 w-full">
          <div className="flex flex-col">
            <div className="user-details">
              <img className="w-12 h-12 mb-2" src={post.user.avatar} />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg hover:underline inline-block">
                {post.user.displayName}
              </span>
              <a className="text-sm">@{post.user.username}</a>
              <span> - </span>
              <span>{formatTimestamp(post?.createdAt)}</span>
            </div>
            <span>{post.content}</span>
            <span>Replying to @{post.user.username}</span>
          </div>
        </div>
        <div className="flex gap-4 p-2 w-full items-start">
          <img className="w-12" src={currentUser?.avatar} />
          <span
            ref={replyContentRef}
            contentEditable
            data-placeholder="Post your reply..."
            data-text
            className="flex text-xl outline-none w-full"
          ></span>
        </div>
        <button
          onClick={() => handleReply(post)}
          className="absolute bottom-1 right-1 bg-green-400 py-2 px-6 mx-2 my-2 text-xl font-bold rounded-xl cursor-pointer"
        >
          Reply
        </button>
      </div>
    </>
  )
}
