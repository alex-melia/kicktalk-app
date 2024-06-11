import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import useAxios from "../hooks/useAxios"
import { HiArrowLeft } from "react-icons/hi2"
import { Standings as TStandings } from "../types/standings"

export default function Standings() {
  const { currentUser } = useAuth()
  const { axiosFetch } = useAxios()

  const navigate = useNavigate()

  const [standings, setStandings] = useState<TStandings>()

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/data/standings/${currentUser?.team?.league}`,
      onSuccess(data) {
        setStandings(data)
      },
    })
  }, [currentUser?.team?.league])

  return (
    <div className="flex flex-col text-center border-x-2 rounded-lg w-full min-h-screen bottom-16 sm:bottom-0">
      {standings && (
        <>
          <div className="sticky top-16 sm:top-0 w-full items-center bg-white border-b-2 p-2">
            <div className="flex gap-4">
              <HiArrowLeft
                className="hover:cursor-pointer"
                size={32}
                onClick={() => navigate(-1)}
              />
              <span className="font-bold text-2xl">Standings</span>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center p-2 w-full mb-4">
            <img
              className="w-8 sm:w-14"
              src={standings.league.logo}
              alt="League logo"
            />
            <span className="font-bold text-xl sm:text-2xl text-center">
              {standings.league.name}
            </span>
          </div>
          <table className="w-full h-full table-auto mb-2">
            <thead>
              <tr>
                <th className="px-1 sm:px-2 text-center text-xs lg:text-xl sm:text-lg font-medium text-gray-500 uppercase tracking-wider">
                  <span className="block sm:hidden">Pos</span>
                  <span className="hidden sm:block">Position</span>
                </th>
                <th className="px-2 text-left text-xs lg:text-xl sm:text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-2 text-center text-xs lg:text-xl sm:text-lg font-medium text-gray-500 uppercase tracking-wider">
                  <span className="block sm:hidden">Pld</span>
                  <span className="hidden sm:block">Played</span>
                </th>
                <th className="px-1 sm:px-2 text-center text-xs lg:text-xl sm:text-lg font-medium text-gray-500 uppercase tracking-wider">
                  W
                </th>
                <th className="px-1 sm:px-2 text-center text-xs lg:text-xl sm:text-lg font-medium text-gray-500 uppercase tracking-wider">
                  D
                </th>
                <th className="px-1 sm:px-2 text-center text-xs lg:text-xl sm:text-lg font-medium text-gray-500 uppercase tracking-wider">
                  L
                </th>
                <th className="px-1 sm:px-2 text-center text-xs lg:text-xl sm:text-lg font-medium text-gray-500 uppercase tracking-wider">
                  GD
                </th>
                <th className="px-1 sm:px-2 text-center text-xs lg:text-xl sm:text-lg font-medium text-gray-500 uppercase tracking-wider">
                  <span className="block sm:hidden">Pts</span>
                  <span className="hidden sm:block">Points</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {standings.league.standings[0]?.map((team, i) => (
                <tr key={i}>
                  <td className="px-1 sm:px-2 text-center">{team.rank}</td>
                  <td className="px-1 sm:px-2 text-center">
                    <Link
                      to={`/team/${team.team.id}`}
                      className="flex items-center gap-2 sm:gap-4"
                    >
                      <img
                        className="w-4 sm:w-8"
                        src={team.team.logo}
                        alt="logo"
                      />
                      <span className="text-sm sm:text-md md:text-xl font-bold">
                        {team.team.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-2 text-center">{team.all.played}</td>
                  <td className="px-2 text-center">{team.all.win}</td>
                  <td className="px-2 text-center">{team.all.draw}</td>
                  <td className="px-2 text-center">{team.all.lose}</td>
                  <td className="px-2 text-center">{team.goalsDiff}</td>
                  <td className="px-1 sm:px-2 text-center font-bold">
                    {team.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
