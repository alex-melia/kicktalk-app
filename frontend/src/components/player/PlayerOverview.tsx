import { useEffect, useState } from "react"

import { League, Trophies } from "../../types"
import { PlayerData, Statistics } from "../../types/player"

interface PlayerObject {
  playerData: PlayerData
}
interface TrophyCount {
  [key: string]: Trophies & { count: number }
}

export default function PlayerOverview({ playerData }: PlayerObject) {
  const [selectedLeague, setSelectedLeague] = useState<string>()
  const [uniqueLeagues, setUniqueLeagues] = useState<League[] | []>([])

  useEffect(() => {
    setSelectedLeague(statistics[0].league.name)
    setUniqueLeagues(extractUniqueLeagues(statistics))
  }, [])

  function extractUniqueLeagues(statistics: Statistics[]) {
    const leagues: League[] = []

    statistics.forEach((stat) => {
      if (!leagues.some((league) => league.id === stat.league.id)) {
        leagues.push(stat.league)
      }
    })

    return leagues
  }

  function formatDate(dateString: any) {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTrophyImageUrl = (leagueName: string): string => {
    const mappings: { [key: string]: string } = {
      "Premier League":
        "https://tmssl.akamaized.net/images/erfolge/header/12.png?lm=1520606997",
      "League Cup":
        "https://tmssl.akamaized.net/images/erfolge/header/47.png?lm=1520606999",
      "La Liga": "url-to-la-liga-trophy-image",
      "Super Cup":
        "https://tmssl.akamaized.net/images/erfolge/header/288.png?lm=1511173147",
      Eredivisie:
        "https://tmssl.akamaized.net/images/erfolge/header/16.png?lm=1520606999",
      "KNVB Beker":
        "https://tmssl.akamaized.net/images/erfolge/header/151.png?lm=1520606999",
    }
    return (
      mappings[leagueName] ||
      "https://tmssl.akamaized.net/images/erfolge/header/default.png?lm=1520606999"
    )
  }

  const renderTrophies = () => {
    if (!playerData.trophies) return null // Early return if trophies are not available

    // Aggregate trophies by league and count them
    const trophyCounts = playerData.trophies
      .filter((trophy: any) => trophy.place === "Winner")
      .reduce<TrophyCount>((acc: any, trophy: any) => {
        const key = trophy.league
        if (!acc[key]) {
          acc[key] = { ...trophy, count: 1 }
        } else {
          acc[key].count += 1
        }
        return acc
      }, {} as TrophyCount) // Type assertion here

    // Convert the aggregated object back into an array for mapping
    const uniqueTrophiesWithCounts = Object.values(trophyCounts)

    // Map over the unique trophies to render them
    return uniqueTrophiesWithCounts.map((trophy: any, index) => (
      <div className="flex flex-col items-center gap-4" key={index}>
        <div className="relative">
          <img
            src={getTrophyImageUrl(trophy.league)}
            alt={`${trophy.league} Trophy`}
            className="w-10 h-10" // Ensure width and height are equal
          />
          {trophy.count && trophy.count > 1 && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full px-2">
              <span className="font-bold text-white text-xs">
                {trophy.count}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-center sm:text-xl">
            {trophy.league}
          </span>
        </div>
        <div>
          <span className="font-bold">{trophy.country}</span>
        </div>
      </div>
    ))
  }

  const statistics = playerData?.statistics

  const totalAppearances = statistics.reduce(
    (acc: any, item: any) => acc + item.games.appearences,
    0
  )
  const totalGoals = statistics.reduce(
    (acc: any, item: any) => acc + item.goals.total,
    0
  )
  const totalAssists = statistics.reduce(
    (acc: any, item: any) => acc + (item.goals.assists ?? 0),
    0
  )
  const totalMinutes = statistics.reduce(
    (acc: any, item: any) => acc + item.games.minutes,
    0
  )

  const avgMinutesPerGoal =
    totalGoals && totalGoals > 0
      ? (totalMinutes / totalGoals).toFixed(0)
      : "N/A"

  return (
    <>
      <div className="flex flex-col w-full mb-12 lg:mb-0">
        <div className="flex flex-col lg:flex-row gap-2 p-2 border-t">
          <div className="flex flex-col p-4 w-1/2 border rounded-xl gap-4 w-full">
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-col col-span-1">
                <span className="font-bold text-lg">
                  {selectedLeague} 23/24
                </span>
                <span className="font-bold text-green-500 text-md">
                  Performance Data
                </span>
              </div>
              <div className="grid grid-cols-5 grid-auto lg:flex lg:gap-2 w-full">
                {uniqueLeagues.map((league, i) => (
                  <div key={i} className="league-image-container">
                    <img
                      className="w-12 p-1"
                      src={
                        league.logo
                          ? league.logo
                          : "https://ia601006.us.archive.org/32/items/no-photo-available//no-photo-available.png"
                      }
                      alt={league.name}
                      onClick={() => setSelectedLeague(league.name)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {playerData?.statistics
              .filter(
                (statistic: any) => statistic.league.name === selectedLeague
              )
              .map((data, i) => {
                const totalPossibleMinutes = data.games.appearences * 90 // Assuming each game is 90 minutes
                const percentageOfMinutesPlayed =
                  (data.games.minutes / totalPossibleMinutes) * 100
                const goalContributions =
                  data.goals.total + (data.goals.assists ?? 0)
                const percentageOfGoalContributions =
                  (goalContributions / data.games.appearences) * 100

                return (
                  <div key={i} className="flex flex-col gap-12 items-center">
                    <div className="grid grid-cols-2 gap-12 w-full">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">Appearences</span>
                          <span className="flex justify-center w-8 bg-gray-100 p-2 font-bold text-green-500">
                            {data.games.appearences
                              ? data.games.appearences
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">Goals</span>
                          <span className="flex justify-center w-8 bg-gray-100 p-2 font-bold text-green-500">
                            {data.goals.total ? data.goals.total : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">Assists</span>
                          <span className="flex justify-center w-8 bg-gray-100 p-2 font-bold text-green-500">
                            {data.goals.assists ? data.goals.assists : "-"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">Yellow Cards</span>
                          <span className="flex justify-center w-8 bg-gray-100 p-2 font-bold text-green-500">
                            {data.cards.yellow ? data.cards.yellow : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">Second Yellows</span>
                          <span className="flex justify-center w-8 bg-gray-100 p-2 font-bold text-green-500">
                            {data.cards.yellowred ? data.cards.yellowred : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">Red Cards</span>
                          <span className="flex justify-center w-8 bg-gray-100 p-2 font-bold text-green-500">
                            {data.cards.red ? data.cards.red : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="flex flex-col items-center gap-2">
                        <span>
                          {Math.round(
                            (data.games.lineups / data.games.appearences) * 100
                          )}
                          %
                        </span>
                        <span className="text-center">Starting eleven</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span>{Math.round(percentageOfMinutesPlayed)}%</span>
                        <span className="text-center">Minutes Played</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span>
                          {Math.round(percentageOfGoalContributions)}%
                        </span>
                        <span className="text-center">Goal Participation</span>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
          <div className="flex flex-col sm:flex-row p-4 w-1/2 border rounded-3xl gap-4 w-full">
            <span className="font-bold text-lg text-center">
              Trophy Cabinet
            </span>
            <div className="grid grid-cols-4 grid-auto gap-4">
              {renderTrophies()}
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 p-2">
          <div className="flex flex-col p-2 border rounded-3xl gap-4 w-full">
            <span className="font-bold text-lg">Stats</span>
            <div className="overflow-x-auto w-full">
              <table className="w-full leading-normal">
                <thead>
                  <tr>
                    <th className="sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      League
                    </th>
                    <th className="sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      <span className="px-2 md:hidden">Apps</span>
                      <span className="hidden md:inline">Appearances</span>
                    </th>
                    <th className=" sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      <span className="md:hidden">Gls</span>
                      <span className="hidden md:inline">Goals</span>
                    </th>
                    <th className="sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      <span className="px-2 md:hidden">A</span>
                      <span className="hidden md:inline">Assists</span>
                    </th>
                    <th className="sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      <span className="px-2 md:hidden">Mins per Goal</span>
                      <span className="hidden md:inline">Minutes per Goal</span>
                    </th>
                    <th className="sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      Minutes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Loop through the data and display each league's statistics */}
                  {statistics.map((item, index) => (
                    <tr key={index}>
                      <td className="sm:px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {item.league.name}
                      </td>
                      <td className="sm:px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                        {item.games.appearences}
                      </td>
                      <td className="sm:px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                        {item.goals.total}
                      </td>
                      <td className="sm:px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                        {item.goals.assists ?? "N/A"}
                      </td>
                      <td className="sm:px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                        {item.goals.total > 0
                          ? (item.games.minutes / item.goals.total).toFixed(0)
                          : "N/A"}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                        {item.games.minutes}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td className="sm:px-5 py-5 border-b border-gray-200 text-sm font-semibold">
                      Total
                    </td>
                    <td className="sm:px-5 py-5 border-b border-gray-200 text-sm text-center">
                      {totalAppearances}
                    </td>
                    <td className="sm:px-5 py-5 border-b border-gray-200 text-sm text-center">
                      {totalGoals}
                    </td>
                    <td className="sm:px-5 py-5 border-b border-gray-200 text-sm text-center">
                      {totalAssists}
                    </td>
                    <td className="sm:px-5 py-5 border-b border-gray-200 text-sm text-center">
                      {avgMinutesPerGoal}
                    </td>
                    <td className="sm:px-5 py-5 border-b border-gray-200 text-sm text-center ">
                      {totalMinutes}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col p-4border rounded-3xl gap-4 w-full">
            <span className="font-bold text-lg">Transfer History</span>
            <div className="w-full">
              <table className="table-fixed w-full">
                <thead>
                  <tr>
                    <th className="sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      Date
                    </th>
                    <th className="px-2 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      Value
                    </th>
                    <th className="px-2 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      From
                    </th>
                    <th className="px-2 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      To
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {playerData.transfers?.transfers.map((transfer, index) => (
                    <tr key={index}>
                      <td className="sm:px-5 text-center py-5 border-b border-gray-200 bg-white text-sm">
                        {formatDate(transfer.date)}
                      </td>
                      <td className="sm:px-5 text-center py-5 border-b border-gray-200 bg-white text-sm">
                        {transfer.type}
                      </td>
                      <td className="sm:px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center justify-center">
                          <img
                            src={transfer.teams.out.logo}
                            alt={transfer.teams.out.name}
                            className="w-6 h-6 mr-2"
                          />
                          <span className="hidden sm:inline">
                            {transfer.teams.out.name}
                          </span>
                        </div>
                      </td>
                      <td className="sm:px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center justify-center">
                          <img
                            src={transfer.teams.in.logo}
                            alt={transfer.teams.in.name}
                            className="w-6 h-6 mr-2"
                          />
                          <span className="hidden sm:inline">
                            {transfer.teams.in.name}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
