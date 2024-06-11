import { FormEvent, useState } from "react"
import useAxios from "../../hooks/useAxios"
import { useAuth } from "../../contexts/AuthContext"
import { Socket } from "socket.io-client"
import { FixtureData } from "../../types/fixture"
import { PlayerData } from "../../types/player"

interface CommentFooterProps {
  socket: Socket
  fixture?: FixtureData
  player?: PlayerData | null
  type: string
}

export default function CommentFooter({
  socket,
  fixture,
  player,
  type,
}: CommentFooterProps) {
  const [comment, setComment] = useState("")
  const { currentUser } = useAuth()
  const { axiosFetch } = useAxios()

  const FIXTURE_ID = type === "fixture" && fixture?.fixture.id
  const PLAYER_ID = type === "player" && player?.player.id

  const sendComment = async (e: FormEvent) => {
    e.preventDefault()
    if (comment?.trim() === "") return
    if (type === "fixture") {
      axiosFetch({
        method: "post",
        url: `/api/comments`,
        requestConfig: {
          data: {
            content: comment,
            commentType: "fixture",
            fixtureId: fixture?.fixture.id,
            userId: currentUser?.id,
          },
        },
        onSuccess: (data) => {
          setComment("")
          if (fixture) {
            socket.emit("newComment", { id: FIXTURE_ID, comment: data })
          } else if (player) {
            socket.emit("newComment", { id: PLAYER_ID, comment: data })
          }
        },
      })
    } else {
      if (PLAYER_ID) {
        axiosFetch({
          method: "post",
          url: `/api/comments`,
          requestConfig: {
            data: {
              content: comment,
              commentType: "player",
              playerId: PLAYER_ID.toString(),
              userId: currentUser?.id,
            },
          },
          onSuccess: (data) => {
            setComment("")
            socket.emit("newComment", { id: PLAYER_ID, comment: data })
          },
        })
      }
    }
  }

  return (
    <div className="flex gap-4 w-full flex my-2">
      <form
        className="flex w-full justify-center gap-4"
        onSubmit={(e) => sendComment(e)}
      >
        <input
          className="bg-gray-100 p-4 rounded-xl w-1/2"
          placeholder="Make a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="bg-green-500 p-4 rounded-xl text-white font-bold">
          Send
        </button>
      </form>
    </div>
  )
}
