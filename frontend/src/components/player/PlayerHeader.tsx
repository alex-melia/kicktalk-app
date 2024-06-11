import { useState } from "react"
import { PlayerData } from "../../types/player"

interface PlayerHeaderProps {
  player: PlayerData | null
  changeOption: (option: string) => void
}

export default function PlayerHeader({
  player,
  changeOption,
}: PlayerHeaderProps) {
  console.log(player)

  function formatDate(dateString: any) {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const [option, setOption] = useState("overview")
  console.log(option)
  return (
    <>
      <div className="flex gap-2 sm:gap-2 bg-green-500 text-white">
        <div className="p-2">
          <img
            className="rounded-xl w-48"
            src={player?.player.photo}
            alt="Player photo"
          />
        </div>

        <div className="flex flex-col w-full items-start gap-4 p-2">
          <div className="flex flex-col">
            <span className="text-xl lg:text-4xl font-light">
              {player?.player.firstname}
            </span>
            <span className="text-2xl lg:text-5xl font-bold">
              {player?.player.lastname}
            </span>
          </div>
          <div className="flex flex-col lg:mx-12">
            <div className="flex gap-2 items-center">
              <span className="lg:text-2xl font-bold">Nationality: </span>
              <span className="lg:text-2xl font-light">
                {player?.player.nationality}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="lg:text-2xl font-bold">Date of Birth: </span>
              <span className="lg:text-2xl font-light">
                {formatDate(player?.player.birth.date)} ({player?.player.age}{" "}
                years)
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="lg:text-2xl font-bold">Height: </span>
              <span className="lg:text-2xl font-light">
                {player?.player.height}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="lg:text-2xl font-bold">Weight: </span>
              <span className="lg:text-2xl font-light">
                {player?.player.weight}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-4 justify-center bg-green-500 text-white pt-4">
        <span
          onClick={() => {
            changeOption("overview")
            setOption("overview")
          }}
          className={`border-x-2 border-t-2 p-2 rounded-t-xl font-bold border-b cursor-pointer ${
            option === "overview" && "bg-white text-green-500 border-b-0"
          }`}
        >
          Overview
        </span>
        <span
          onClick={() => {
            changeOption("comments")
            setOption("comments")
          }}
          className={`border-x-2 border-t-2 p-2 rounded-t-xl font-bold border-b cursor-pointer ${
            option === "comments" && "bg-white text-green-500 border-b-0"
          }`}
        >
          Comments
        </span>
      </div>
    </>
  )
}
