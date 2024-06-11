import { useState } from "react"
import { TeamStats as ITeamStats } from "../../types/team"

interface TeamStatsProps {
  stats: ITeamStats[]
}

export default function TeamStats({ stats }: TeamStatsProps) {
  const [selectedLeagueId, setSelectedLeagueId] = useState(stats[0]?.league?.id)

  const handleLeagueChange = (event: any) => {
    setSelectedLeagueId(parseInt(event.target.value, 10))
  }

  const selectedStats = stats.find(
    (stat: any) => stat.league.id === selectedLeagueId
  )

  return (
    <div>
      <div className="mb-4">
        <label
          htmlFor="league-select"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Select a League:
        </label>
        <select
          id="league-select"
          value={selectedLeagueId}
          onChange={handleLeagueChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          {stats.map((stat: any) => (
            <option key={stat.league.id} value={stat.league.id}>
              {stat.league.name}
            </option>
          ))}
        </select>
      </div>
      {selectedStats ? (
        <div className="border rounded-xl p-2">
          <h3 className="font-bold text-lg">
            {selectedStats.league.name} Stats
          </h3>
          <div>Form: {selectedStats.form}</div>
          <div>
            Matches Played: Home: {selectedStats.fixtures.played.home}, Away:{" "}
            {selectedStats.fixtures.played.away}
          </div>
          <div>
            Wins: Home: {selectedStats.fixtures.wins.home}, Away:{" "}
            {selectedStats.fixtures.wins.away}
          </div>
          <div>
            Draws: Home: {selectedStats.fixtures.draws.home}, Away:{" "}
            {selectedStats.fixtures.draws.away}
          </div>
          <div>
            Loses: Home: {selectedStats.fixtures.loses.home}, Away:{" "}
            {selectedStats.fixtures.loses.away}
          </div>
          <div>
            Goals For: Home: {selectedStats.goals.for.home}, Away:{" "}
            {selectedStats.goals.for.away}
          </div>
          <div>
            Goals Against: Home: {selectedStats.goals.against.home}, Away:{" "}
            {selectedStats.goals.against.away}
          </div>
        </div>
      ) : (
        <p>No stats available for the selected league.</p>
      )}
    </div>
  )
}
