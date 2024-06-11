import { useEffect, useState } from "react"
import useAxios from "../../hooks/useAxios"
import { PlayerData } from "../../types/player"
import { Comment } from "../../types/shared"
import { Socket } from "socket.io-client"

import CommentList from "../fixture/CommentList"
import CommentFooter from "../fixture/CommentFooter"

interface PlayerCommentsProps {
  player: PlayerData | null
  socket: Socket
}
export default function PlayerComments({
  player,
  socket,
}: PlayerCommentsProps) {
  const { axiosFetch } = useAxios()
  const [comments, setComments] = useState<Comment[]>([])
  const [dateRange, setDateRange] = useState("latest")

  useEffect(() => {
    socket.on("commentReceived", (data: Comment) => {
      setComments([...comments, data])
      console.log(data)
    })
  }, [socket, comments])

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/comments/player/${player?.player.id}?range=${dateRange}`,
      onSuccess(data) {
        setComments(data)
      },
    })
  }, [player])

  useEffect(() => {
    const fetchComments = (range: string) => {
      axiosFetch({
        method: "get",
        url: `/api/comments/player/${player?.player.id}?range=${range}`,
        onSuccess: (data) => {
          setComments(data)
        },
      })
    }

    fetchComments(dateRange)
  }, [player?.player.id, dateRange])

  return (
    <>
      <div className="p-2">
        <select
          className="border rounded-xl w-48 p-2"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="24h">Last 24 Hours</option>
          <option value="1w">Last Week</option>
          <option value="1m">Last Month</option>
          <option value="1y">Last Year</option>
          <option value="latest">Latest</option>
        </select>
        <CommentList comments={comments} type="player" />
        <CommentFooter player={player} socket={socket} type="player" />
      </div>
    </>
  )
}
