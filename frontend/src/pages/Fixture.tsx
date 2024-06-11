import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useAxios from "../hooks/useAxios"
import { FixtureData } from "../types/fixture.ts"
import { HiArrowLeft } from "react-icons/hi2"
import { Socket } from "socket.io-client"

import FixtureStats from "../components/fixture/FixtureStats"
import FixtureLineups from "../components/fixture/FixtureLineups"
import FixtureComments from "../components/fixture/FixtureComments"
import FixtureHeader from "../components/fixture/FixtureHeader.tsx"
import SideComponents from "../components/common/SideComponents.tsx"

interface FixtureProps {
  socket: Socket
}

export default function Fixture({ socket }: FixtureProps) {
  const { id } = useParams<string>()
  const { axiosFetch } = useAxios()

  const [fixture, setFixture] = useState<FixtureData>()
  const [headToHead, setHeadToHead] = useState<FixtureData[]>()
  const [option, setOption] = useState<string>("stats")

  const navigate = useNavigate()

  const changeOption = (newOption: string) => {
    setOption(newOption)
  }

  useEffect(() => {
    socket.emit("joinFixture", Number(id))

    return () => {
      socket.emit("leaveFixture", Number(id))
      socket.off("commentReceived")
    }
  }, [id, socket])

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
    if (fixture) {
      axiosFetch({
        method: "get",
        url: `/api/data/fixture/headtohead/${fixture?.teams.home.id}-${fixture?.teams.away.id}`,
        onSuccess(data) {
          setHeadToHead(data)
        },
      })
    }
  }, [fixture])

  console.log(fixture)

  return (
    <div className="flex w-full gap-2">
      <div className="relative w-full h-full min-h-screen lg:w-3/4 border-x-2 border-gray-200">
        <div className="flex-1">
          <div className="sticky top-16 sm:top-0 w-full z-[35] flex p-2 gap-4 items-center bg-white border-b-2">
            <HiArrowLeft
              className="hover:cursor-pointer"
              size={32}
              onClick={() => navigate(-1)}
            />
            <span className="font-bold text-2xl">Fixture</span>
          </div>
          <div className="flex flex-col h-full">
            {fixture && (
              <FixtureHeader fixture={fixture} changeOption={changeOption} />
            )}
            {option === "stats" && (
              <>
                {fixture && (
                  <FixtureStats fixture={fixture} headToHead={headToHead} />
                )}
              </>
            )}
            {option === "lineups" && <FixtureLineups fixture={fixture} />}
            {option === "comments" && (
              <>
                {fixture && (
                  <FixtureComments fixture={fixture} socket={socket} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <SideComponents />
    </div>
  )
}
