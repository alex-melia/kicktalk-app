import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { HiArrowUp, HiArrowDown, HiArrowsUpDown } from "react-icons/hi2"
import { Player } from "../../types/player"

interface SquadListProps {
  players: Player[]
}

export default function SquadList({ players }: SquadListProps) {
  const [sortField, setSortField] = useState<keyof Player | "">("")
  const [sortDirection, setSortDirection] = useState("asc")

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortField === "") return 0
    if (a[sortField] < b[sortField]) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  const handleSort = (field: keyof Player | "") => {
    if (sortField === field && sortDirection === "asc") {
      setSortDirection("desc")
    } else {
      setSortDirection("asc")
    }
    setSortField(field)
  }

  const renderSortArrow = (field: any) => {
    if (sortField === field) {
      return sortDirection === "asc" ? <HiArrowUp /> : <HiArrowDown />
    } else {
      return <HiArrowsUpDown />
    }
  }

  const squadStats = useMemo(() => {
    const totalPlayers = players.length
    const totalAge = players.reduce(
      (acc: any, player: any) => acc + player.age,
      0
    )
    const averageAge = totalPlayers ? (totalAge / totalPlayers).toFixed(1) : 0
    return { totalPlayers, averageAge }
  }, [players])

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-2">
      <table className="border w-full lg:w-2/3 table-auto">
        <thead>
          <tr className="border">
            {["#", "Name", "Position", "Age"].map((header) => (
              <td
                key={header}
                className="border-r font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() =>
                  handleSort(header.toLowerCase() as keyof Player | "")
                }
              >
                <div className="flex items-center gap-2 justify-center">
                  <span>{header}</span>
                  {renderSortArrow(header.toLowerCase())}
                </div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player: any) => (
            <tr className="border" key={player.id}>
              <td className="text-center border-r">
                {player.number ? player.number : "N/A"}
              </td>
              <div className="flex border-r">
                <td className="flex items-center gap-2">
                  <img className="w-10" src={player.photo} />
                  <Link to={`/player/${player.id}`}>
                    <span className="text-xs sm:text-sm text-green-500 font-bold">
                      {player.name}
                    </span>
                  </Link>
                </td>
              </div>
              <td className="border-r text-center">{player.position}</td>
              <td className="text-center">{player.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full lg:w-1/3">
        <div className="border rounded-xl p-2">
          <h2 className="font-bold text-xl">Squad Stats</h2>
          <p>Squad size: {squadStats.totalPlayers}</p>
          <p>Average age: {squadStats.averageAge}</p>
        </div>
      </div>
    </div>
  )
}
