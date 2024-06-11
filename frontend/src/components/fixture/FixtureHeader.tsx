import { IoMdCalendar } from "react-icons/io"
import formatFixture from "../../utils/formatFixture"
import { MdStadium } from "react-icons/md"
import { GiWhistle } from "react-icons/gi"
import ScoreHeader from "./ScoreHeader"
import { FixtureData } from "../../types/fixture"
import { useState } from "react"

interface FixtureHeaderProps {
  fixture: FixtureData
  changeOption: (e: string) => void
}

export default function FixtureHeader({
  fixture,
  changeOption,
}: FixtureHeaderProps) {
  const [option, setOption] = useState("stats")
  return (
    <div className="flex flex-col bg-green-500 font-bold text-white gap-2 items-center w-full pt-2">
      <div className="flex justify-center items-center gap-8 rounded-lg p-2">
        <div className="flex items-center gap-2">
          <IoMdCalendar size={24} />
          <span>
            {fixture?.fixture.date && formatFixture(fixture?.fixture.date)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MdStadium size={24} />
          <span>{fixture?.fixture.venue.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <GiWhistle size={24} />
          <span>{fixture?.fixture.referee}</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span>{fixture?.league.name}</span>
        <img className="w-12" src={fixture?.league.logo} alt="League logo" />
      </div>
      {fixture?.fixture.status.elapsed && (
        <span className="text-xl text-center">
          {fixture?.fixture.status.elapsed}'
        </span>
      )}
      {fixture?.fixture.status.short === "NS" ? (
        <div className="flex items-center gap-8">
          <div className="flex flex-col sm:flex-row flex-col-reverse items-center gap-2 sm:gap-4">
            <span className="text-xl sm:text-3xl">
              {fixture?.teams.home.name}
            </span>
            <img
              className="w-16"
              src={fixture?.teams.home.logo}
              alt="Team logo"
            />
          </div>
          <span className="flex justify-center text-3xl">vs</span>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <img
              className="w-16"
              src={fixture?.teams.away.logo}
              alt="Team logo"
            />
            <span className="text-xl sm:text-3xl">
              {fixture?.teams.away.name}
            </span>
          </div>
        </div>
      ) : (
        <>
          <ScoreHeader fixture={fixture} />
        </>
      )}

      {fixture?.fixture.status.short === "NS" && (
        <div className="flex flex-col items-center gap-2">
          <span>COUNTDOWN TO KICKOFF</span>
          <span>10 9 8 2</span>
        </div>
      )}

      <div className="flex gap-4">
        <span
          className={`rounded-tl-lg bg-green-500  rounded-tr-lg p-2 cursor-pointer ${
            option === "line-ups" && "bg-white text-green-500 border-b-0"
          }`}
          onClick={() => {
            changeOption("lineups"), setOption("line-ups")
          }}
        >
          Line Ups
        </span>
        <span
          className={`rounded-tl-lg bg-green-500  rounded-tr-lg p-2 cursor-pointer ${
            option === "stats" && "bg-white text-green-500 border-b-0"
          }`}
          onClick={() => {
            changeOption("stats"), setOption("stats")
          }}
        >
          Stats
        </span>
        <span
          className={`rounded-tl-lg bg-green-500  rounded-tr-lg p-2 cursor-pointer ${
            option === "comments" && "bg-white text-green-500 border-b-0"
          }`}
          onClick={() => {
            changeOption("comments"), setOption("comments")
          }}
        >
          Comments
        </span>
      </div>
    </div>
  )
}
