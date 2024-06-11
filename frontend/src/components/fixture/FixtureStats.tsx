import { useState } from "react"
import { Link } from "react-router-dom"
import formatFixture from "../../utils/formatFixture"
import { FixtureData } from "../../types/fixture"

interface FixtureStatsProps {
  fixture: FixtureData
  headToHead: any
}

export default function FixtureStats({
  fixture,
  headToHead,
}: FixtureStatsProps) {
  const [statsOption, setStatsOption] = useState("h2h")

  const STATS = fixture?.statistics
  const homeStats = STATS?.find(
    (team: any) => team.team.id === fixture?.teams.home.id
  )?.statistics
  const awayStats = STATS?.find(
    (team: any) => team.team.id === fixture?.teams.away.id
  )?.statistics

  return (
    <div className="flex flex-col items-center p-2 mb-6">
      <div className="flex justify-center gap-4 my-6">
        <span
          className="border p-2 cursor-pointer"
          onClick={() => setStatsOption("h2h")}
        >
          Head to Head
        </span>
        <span
          className="border p-2 cursor-pointer"
          onClick={() => setStatsOption("match-stats")}
        >
          Match Stats
        </span>
      </div>
      {statsOption === "h2h" ? (
        <div className="flex flex-col gap-4 items-center">
          <span className="font-bold text-center text-3xl">
            Recent Meetings
          </span>
          {headToHead?.map((fixture: any, i: number) => (
            <Link
              className="hover:bg-gray-100 transition ease-in-out p-1"
              to={`/fixture/${fixture.fixture.id}`}
            >
              <div className="flex flex-col gap-2" key={i}>
                <div className="flex flex-col items-center">
                  <span>{formatFixture(fixture.fixture.date)}</span>
                  <span>
                    {fixture.fixture.venue.name}, {fixture.fixture.venue.city}
                  </span>
                </div>
                <div className="grid grid-flow-col grid-cols-3 items-center">
                  <div className="flex gap-2 sm:gap-4 items-center justify-end">
                    <span className="font-bold text-sm sm:text-xl">
                      {fixture.teams.home.name}
                    </span>
                    <img
                      className="w-8 sm:w-12"
                      src={fixture.teams.home.logo}
                      alt="Team logo"
                    />
                  </div>
                  <div className="flex justify-center p-2">
                    <span className="bg-black font-bold text-white px-4 py-2">
                      {fixture.goals.home} - {fixture.goals.away}
                    </span>
                  </div>

                  <div className="flex gap-2 sm:gap-4 items-center">
                    <img
                      className="w-8 sm:w-12"
                      src={fixture.teams.away.logo}
                      alt="Team logo"
                    />
                    <span className="font-bold text-sm sm:text-xl">
                      {fixture.teams.away.name}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <>
          {fixture?.fixture.status.short !== "NS" ? (
            <div className="flex flex-col w-2/3 items-center">
              <span className="text-3xl font-bold ">MATCH STATS</span>
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">{fixture?.teams.home.name}</th>
                    <th className="px-4 py-2"></th>
                    <th className="px-4 py-2">{fixture?.teams.away.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {homeStats?.map((statistic: any, i: number) => {
                    const homeValue = statistic.value
                    const awayValue = awayStats?.[i]?.value
                    const isHomeHigher = Number(homeValue) > Number(awayValue)
                    const isAwayHigher = Number(homeValue) < Number(awayValue)

                    const rowBgClass = i % 2 === 0 ? "bg-gray-100" : "bg-white"

                    return (
                      <tr key={i} className={`text-center ${rowBgClass}`}>
                        <td
                          className={`px-4 py-2 ${
                            isHomeHigher ? "font-bold" : ""
                          }`}
                        >
                          {homeValue !== null ? homeValue : "-"}
                        </td>
                        <td className="px-4 py-2 font-medium">
                          {statistic.type}
                        </td>
                        <td
                          className={`px-4 py-2 ${
                            isAwayHigher ? "font-bold" : ""
                          }`}
                        >
                          {awayValue !== null ? awayValue : "-"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <span className="font-bold text-lg">
                Match stats will be available when the match kicks off!
              </span>
            </>
          )}
        </>
      )}
    </div>
  )
}
