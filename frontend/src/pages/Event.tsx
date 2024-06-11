import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useAxios from "../hooks/useAxios"
import { HiArrowLeft } from "react-icons/hi2"
import formatFixture from "../utils/formatFixture"
import PostList from "../components/posts/PostList"
import { IoMdCalendar } from "react-icons/io"
import { MdStadium } from "react-icons/md"
import { GiWhistle } from "react-icons/gi"
import FixtureHeader from "../components/fixture/ScoreHeader"
import { Post } from "../types"
import { FixtureData } from "../types/fixture"
import SideComponents from "../components/common/SideComponents"

export default function Event() {
  const { id } = useParams<string>()
  const { axiosFetch } = useAxios()
  const navigate = useNavigate()

  const [posts, setPosts] = useState<Post[] | null>(null)
  const [fixture, setFixture] = useState<FixtureData | null>(null)
  const [postsOption, setPostsOption] = useState<string>("top-posts")

  useEffect(() => {
    axiosFetch({
      method: "post",
      url: `/api/posts/fixture/${id}`,
      requestConfig: {
        data: {
          type: postsOption,
        },
      },
      onSuccess(data) {
        setPosts(data)
      },
    })
  }, [])

  useEffect(() => {
    const fetchData = () => {
      axiosFetch({
        method: "get",
        url: `/api/data/fixture/${id}`,
        onSuccess: async (data) => {
          setFixture(data)
        },
      })
    }

    fetchData()

    const interval = setInterval(async () => {
      if (fixture && ["FT", "NS"].includes(fixture.fixture.status.short)) {
        clearInterval(interval)
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    axiosFetch({
      method: "post",
      url: `/api/posts/fixture/${id}`,
      requestConfig: {
        data: {
          type: postsOption,
        },
      },
      onSuccess(data) {
        setPosts(data)
      },
    })
  }, [postsOption])

  return (
    <div className="flex w-full gap-5 h-full min-h-screen">
      <div className="lg:w-2/3 border-x-2 flex flex-col w-full">
        <div className="sticky top-0 bg-white">
          <div className="border-b">
            <div className="flex items-center gap-4 p-4">
              <HiArrowLeft
                className="hover:cursor-pointer"
                size={32}
                onClick={() => navigate(-1)}
              />
              <span className="font-bold text-2xl">
                {fixture?.teams.home.name} vs. {fixture?.teams.away.name}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-green-500 h-fit">
          <div className="flex flex-col bg-green-500 font-bold text-white gap-2 items-center w-full pt-2">
            <div className="flex justify-center items-center gap-8 rounded-lg p-2 mx-4 bg-white text-green-500 font-bold shadow-md">
              <div className="flex items-center gap-2">
                <IoMdCalendar size={24} />
                <span className="text-xs">
                  {fixture?.fixture.date &&
                    formatFixture(fixture?.fixture.date)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MdStadium size={24} />
                <span className="text-xs">{fixture?.fixture.venue.name}</span>
              </div>
              <div className="flex items-center gap-2 hidden sm:block">
                <GiWhistle size={24} />
                <span className="text-xs">{fixture?.fixture.referee}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span>{fixture?.league.name}</span>
              <img
                className="w-12"
                src={fixture?.league.logo}
                alt="League logo"
              />
            </div>
            {fixture?.fixture.status.elapsed && (
              <span className="text-xl text-center">
                {fixture?.fixture.status.elapsed}'
              </span>
            )}
            {fixture?.fixture.status.short === "NS" ? (
              <div className="flex justify-between items-center sm:grid grid-flow-col grid-cols-3 place-items-center w-11/12 sm:w-full">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8">
                  <img
                    className="w-12 sm:w-16"
                    src={fixture?.teams.home.logo}
                    alt="Team logo"
                  />
                  <span className="text-lg">{fixture?.teams.home.name}</span>
                </div>
                <span className="text-2xl sm:text-5xl">vs</span>
                <div className="flex flex-col flex-col-reverse sm:flex-row items-center gap-2 sm:gap-8">
                  <span className="text-lg">{fixture?.teams.away.name}</span>
                  <img
                    className="w-12 sm:w-16"
                    src={fixture?.teams.away.logo}
                    alt="Team logo"
                  />
                </div>
              </div>
            ) : (
              <>{fixture && <FixtureHeader fixture={fixture} />}</>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 border-y">
          <div
            onClick={() => setPostsOption("top-posts")}
            className="flex p-2 font-bold hover:bg-gray-100 hover:cursor-pointer w-full justify-center border-r"
          >
            <span className="text-xl">Top Posts</span>
          </div>
          <div
            onClick={() => setPostsOption("latest")}
            className="flex p-2 font-bold hover:bg-gray-100 hover:cursor-pointer w-full justify-center"
          >
            <span className="text-xl">Latest</span>
          </div>
        </div>
        {postsOption && <>{posts && <PostList posts={posts} />}</>}
      </div>
      <SideComponents />
    </div>
  )
}
