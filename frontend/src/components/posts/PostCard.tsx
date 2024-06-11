import { Link } from "react-router-dom"
import { BsThreeDots } from "react-icons/bs"
import { HiArrowsPointingOut } from "react-icons/hi2"
import { Post } from "../../types"

import formatTimestamp from "../../utils/formatTimestamp"
import PostPopup from "./PostPopup"
import PostFunctions from "./PostFunctions"

interface PostCardProps {
  post: Post
}
export default function PostCard({ post }: PostCardProps) {
  const mediaContent =
    post.media && post.media.length > 1 ? (
      <div className="grid grid-cols-2 gap-2">
        {Array.isArray(post.media) &&
          post.media.map((media: string, i: number) => (
            <img key={i} className="w-full" src={media} alt={`Media ${i}`} />
          ))}
      </div>
    ) : (
      <img className="w-full" src={post.media} />
    )

  return (
    <>
      <div className="flex flex-col w-full">
        <Link to={`/${post.user.username}/status/${post._id}`}>
          {post?.isRepost && (
            <div className="m-2 flex items-center gap-2">
              <HiArrowsPointingOut size={18} color="green" />
              <span className="font-bold">{post.repostedBy} reposted</span>
            </div>
          )}
          <Link
            className="flex w-full gap-2"
            to={`/${post.user.username}/status/${post._id}`}
          >
            <div className="relative group">
              <Link to={`/${post.user.username}`}>
                <img
                  className="w-12 h-12 after:absolute after:inset-x-0 after:top-full after:mx-auto after:block after:w-0.5 after:h-24 after:bg-black "
                  src={post.user.avatar}
                />
              </Link>
              <PostPopup user={post.user} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex relative items-center gap-1">
                <Link to={`/${post.user.username}`}>
                  <span className="relative group font-bold text-lg hover:underline inline-block">
                    {post.user.displayName}
                    <PostPopup user={post.user} />
                  </span>
                </Link>
                <Link to={`/${post.user.username}`}>@{post.user.username}</Link>
                <span> - </span>
                <span>{formatTimestamp(post?.createdAt)}</span>
                <div className="hidden sm:block">
                  {post.fixture && (
                    <Link
                      to={`/event/${post.fixture.id}`}
                      className="ml-4 bg-green-500 p-1 text-white font-bold rounded-xl"
                    >
                      <span className="text-sm">
                        {post.fixture.home} vs {post.fixture.away}
                      </span>
                    </Link>
                  )}
                </div>
                <div className="absolute right-1">
                  <div className="relative group">
                    <BsThreeDots
                      size={24}
                      className="p-1 hover:bg-green-500 rounded-xl"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:hidden mb-2">
                {post.fixture && (
                  <Link
                    to={`/event/${post.fixture.id}`}
                    className="bg-green-500 p-0.5 text-white font-bold rounded-xl"
                  >
                    <span className="text-sm">
                      {post.fixture.home} vs {post.fixture.away}
                    </span>
                  </Link>
                )}
              </div>
              <span>{post.content}</span>
              <div className="flex justify-center">
                <div className="max-w-96">{mediaContent}</div>
              </div>
              <PostFunctions post={post} />
            </div>
          </Link>
        </Link>
      </div>
    </>
  )
}
