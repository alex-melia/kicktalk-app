import { Post } from "../../types"
import PostCard from "./PostCard"

interface ReplyListProps {
  posts: Post[]
}

export default function ReplyList({ posts }: ReplyListProps) {
  return (
    <>
      {posts.length > 0 &&
        posts.map((post: Post, i: number) => (
          <>
            {post?.replyingTo && (
              <div
                className={`flex 
                flex-col
               p-2 gap-4 border-b-2 w-full hover:cursor-pointer hover:bg-gray-100 transition z-10`}
                key={i}
              >
                <PostCard post={post?.replyingTo} />
                <PostCard post={post} key={post._id} />
              </div>
            )}
          </>
        ))}
    </>
  )
}
