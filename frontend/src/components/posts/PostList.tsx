import PostCard from "./PostCard"
import { Post } from "../../types"

interface PostListProps {
  posts: Post[] | null
}

export default function PostList({ posts }: PostListProps) {
  return (
    <>
      {posts?.length ? (
        posts?.map((post: Post, i: number) => (
          <div
            className={`flex p-2 border-b-2 w-full hover:cursor-pointer hover:bg-gray-100 transition z-10`}
            key={i}
          >
            <PostCard post={post} key={post._id} />
          </div>
        ))
      ) : (
        <p className="text-center text-lg font-semibold mt-4">
          No posts to show!
        </p>
      )}
    </>
  )
}
