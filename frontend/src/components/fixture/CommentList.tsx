import { Comment as TComment } from "../../types/shared"
import Comment from "./Comment"

interface CommentListProps {
  comments: TComment[]
  type?: string
}

export default function CommentList({ comments, type }: CommentListProps) {
  return (
    <div className=" flex flex-col gap-2 overflow-y-scroll h-[700px] border p-2">
      {comments && comments.length > 0 ? (
        comments.map((comment: TComment) => (
          <Comment key={comment._id} initialComment={comment} />
        ))
      ) : (
        <div className="h-full flex justify-center mt-4">
          <span className="h-full text-xl">
            No comments made for this {type}
          </span>
        </div>
      )}
    </div>
  )
}
