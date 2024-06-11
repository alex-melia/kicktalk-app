import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Socket } from "socket.io-client"
import useAxios from "../hooks/useAxios"
import { HiArrowLeft } from "react-icons/hi2"
import { PlayerData } from "../types/player"

import PlayerHeader from "../components/player/PlayerHeader"
import PlayerOverview from "../components/player/PlayerOverview"
import PlayerComments from "../components/player/PlayerComments"

interface PlayerProps {
  socket: Socket
}

export default function Player({ socket }: PlayerProps) {
  const { id } = useParams<string>()
  const { axiosFetch } = useAxios()

  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [option, setOption] = useState<string>("overview")

  const navigate = useNavigate()

  useEffect(() => {
    socket.emit("joinPlayer", Number(id))

    return () => {
      socket.emit("leavePlayer", Number(id))
      socket.off("commentReceived")
    }
  }, [id, socket])

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/data/player/${id}`,
      onSuccess(data) {
        const mergedData = mergeLeagueStatistics(data)
        setPlayer(mergedData)
      },
    })
  }, [id])

  function mergeLeagueStatistics(playerData: PlayerData) {
    const leagueIndexMap = new Map<number, number>()

    playerData.statistics.forEach((stat, index) => {
      const leagueId = stat.league.id

      if (!leagueIndexMap.has(leagueId)) {
        leagueIndexMap.set(leagueId, index)
      } else {
        const existingIndex = leagueIndexMap.get(leagueId)!
        const existingStat = playerData.statistics[existingIndex]

        if (stat.games && typeof stat.games.appearences === "number") {
          existingStat.games.appearences =
            (existingStat.games.appearences || 0) + stat.games.appearences
        }
        playerData.statistics.splice(index, 1)
      }
    })

    return playerData
  }

  return (
    <div className="flex flex-col w-full border-x-2">
      <div className="sticky top-16 sm:top-0 flex w-full items-center p-2 gap-4 z-30 bg-white border-b-2">
        <HiArrowLeft
          className="hover:cursor-pointer"
          size={32}
          onClick={() => navigate(-1)}
        />
        <span className="font-bold text-2xl">{player?.player.name}</span>
      </div>

      <PlayerHeader player={player} changeOption={setOption} />

      {option === "overview" ? (
        <>{player && <PlayerOverview playerData={player} />}</>
      ) : (
        <div className="flex flex-col gap-2 p-2 ">
          <PlayerComments player={player} socket={socket} />
        </div>
      )}
    </div>
  )
}
