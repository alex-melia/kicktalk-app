import { useEffect, useState } from "react"
import CommentFooter from "./CommentFooter"
import CommentList from "./CommentList"
import useAxios from "../../hooks/useAxios"
import { FixtureData } from "../../types/fixture"
import { Socket } from "socket.io-client"
import { Comment } from "../../types/shared"

interface FixtureCommentsProps {
  fixture: FixtureData
  socket: Socket
}

export default function FixtureComments({
  fixture,
  socket,
}: FixtureCommentsProps) {
  const { axiosFetch } = useAxios()
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    socket.on("commentReceived", (data: any) => {
      setComments([...comments, data])
      console.log(data)
    })
  }, [socket, comments])

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/comments/fixture/${fixture?.fixture.id}`,
      onSuccess(data) {
        setComments(data)
      },
    })
  }, [fixture])

  return (
    <>
      {fixture.fixture.status.short === "NS" ? (
        <div className="flex justify-center mt-6">
          <span className="font-bold text-lg">
            Live comments will be available when the match starts!
          </span>
        </div>
      ) : (
        <>
          {fixture.fixture.status.short === "FT" ? (
            <div className="h-full p-2">
              <span className="font-bold">Top Comments</span>
              <CommentList
                comments={comments.sort((a, b) => b.voteCount - a.voteCount)}
                type="fixture"
              />
            </div>
          ) : (
            <>
              <div className="p-2">
                <span className="font-bold">Live Comments</span>
                <CommentList comments={comments} type="fixture" />
                <CommentFooter
                  fixture={fixture}
                  socket={socket}
                  type="fixture"
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
