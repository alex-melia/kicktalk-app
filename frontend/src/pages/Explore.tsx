import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useAxios from "../hooks/useAxios"
import { TodayFixture } from "../types/fixture"
import { Post } from "../types"

import SearchBar from "../components/common/Search"
import TodaysFixtures from "../components/explore/TodaysFixtures"
import PostList from "../components/posts/PostList"
import SideComponents from "../components/common/SideComponents"

interface Trending {
  value: string
  score: number
}

export default function Explore() {
  const [option, setOption] = useState("trending")
  const [query, setQuery] = useState("")
  const { axiosFetch } = useAxios()

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
  }

  const [trending, setTrending] = useState<Trending[] | null>([])
  const [todaysFixtures, setTodaysFixtures] = useState<TodayFixture[][] | null>(
    []
  )
  const [topPosts, setTopPosts] = useState<Post[] | null>([])
  const [mostRepliedPosts, setMostRepliedPosts] = useState<Post[] | null>([])

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/data/trending`,
      onSuccess(data) {
        setTrending(data)
      },
    })

    axiosFetch({
      method: "get",
      url: `/api/data/todays-fixtures`,
      onSuccess(data) {
        setTodaysFixtures(data)
      },
    })

    axiosFetch({
      method: "get",
      url: `/api/posts/top-posts`,
      onSuccess(data) {
        setTopPosts(data)
      },
    })

    axiosFetch({
      method: "get",
      url: `/api/posts/most-replied`,
      onSuccess(data) {
        setMostRepliedPosts(data)
      },
    })
  }, [])

  console.log(topPosts)

  return (
    <div className="flex w-full gap-5">
      <div className="flex flex-col w-full lg:w-2/3 h-full border-x-2 min-h-screen">
        <div className="flex flex-col sticky top-16 sm:top-0 w-full gap-4 border-b z-30 bg-white">
          <div className="p-2">
            <SearchBar query={query} setQuery={handleQueryChange} />
          </div>
          <div className="grid grid-cols-4 place-items-center">
            <div
              onClick={() => setOption("trending")}
              className="flex justify-center p-2 hover:bg-gray-100 hover:cursor-pointer text-md sm:text-xl w-full"
            >
              <span className="font-bold">Trending</span>
            </div>
            <div
              onClick={() => setOption("live")}
              className="flex justify-center p-2 hover:bg-gray-100 hover:cursor-pointer text-md sm:text-xl w-full"
            >
              <span className="font-bold">Live</span>
            </div>
            <div
              onClick={() => setOption("top-posts")}
              className="flex justify-center p-2 hover:bg-gray-100 hover:cursor-pointer text-md sm:text-xl w-full"
            >
              <span className="font-bold">Top Posts</span>
            </div>
            <div
              onClick={() => setOption("most-replied")}
              className="flex justify-center p-2 hover:bg-gray-100 hover:cursor-pointer text-md sm:text-xl w-full"
            >
              <span className="font-bold">Most Replied</span>
            </div>
          </div>
        </div>
        {option === "trending" && (
          <>
            <div className="flex flex-col p-2">
              <span className="font-bold text-3xl p-2">Trending</span>
              {trending?.length ? (
                trending?.map((trend: any, i) => (
                  <Link
                    className="flex flex-col hover:bg-gray-100 transition ease-in-out p-2 rounded-xl"
                    to={`/search?q=${trend.value}&type=posts`}
                    key={i}
                  >
                    <span className="font-bold text-2xl">{trend.value}</span>
                    <span>{trend.score} posts</span>
                  </Link>
                ))
              ) : (
                <p className="text-center font-semibold text-lg mt-4">
                  No recent posts!
                </p>
              )}
            </div>
          </>
        )}
        {option === "live" && (
          <>
            <TodaysFixtures fixtures={todaysFixtures} />
          </>
        )}
        {option === "top-posts" && (
          <>
            <PostList posts={topPosts} />
          </>
        )}
        {option === "most-replied" && (
          <>
            <PostList posts={mostRepliedPosts} />
          </>
        )}
      </div>
      <SideComponents />
    </div>
  )
}
