import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useAxios from "../hooks/useAxios"
import { HiArrowLeft } from "react-icons/hi2"
import SquadList from "../components/team/SquadList"
import FixturesList from "../components/team/FixturesList"
import TeamStats from "../components/team/TeamStats"
import { FixtureData } from "../types/fixture"
import { LeagueR } from "../types/standings"

interface TeamData {
  team: Team
  venue: Venue
}

interface Team {
  id: string
  name: string
  country: string
  logo: string
  founded: string
}

interface Venue {
  address: string
  capacity: number
  city: string
  id: number
  image: string
  name: string
}

interface SArr {}

interface Data {
  country: string
  flag: string
  id: number
  logo: string
  name: string
  season: string
  standings: SArr
}

interface Entry {
  league: Data
}

export default function Team() {
  const { id } = useParams<string>()
  const { axiosFetch } = useAxios()
  const [team, setTeam] = useState<TeamData>()
  const [stats, setStats] = useState<any>()
  const [squad, setSquad] = useState<any>()
  const [fixtures, setFixtures] = useState<FixtureData[]>()
  const [standings, setStandings] = useState<any>()
  const [upcomingFixture, setUpcomingFixture] = useState<any>()
  const [leagueStandings, setLeagueStandings] = useState<LeagueR>()
  // const [transfers, setTransfers] = useState<any>()

  const [season, setSeason] = useState<any>("2023")

  const [option, setOption] = useState("overview")

  const navigate = useNavigate()

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/data/team/${id}`,
      onSuccess(data) {
        setTeam(data)
      },
    })
    if (season) {
      console.log(season)

      axiosFetch({
        method: "get",
        url: `/api/data/team-stats/${id}?season=${season}`,

        onSuccess(data) {
          setStats(data)
        },
      })
    }
    axiosFetch({
      method: "get",
      url: `/api/data/squad/${id}`,
      onSuccess(data) {
        setSquad(data)
      },
    })
    axiosFetch({
      method: "get",
      url: `/api/data/fixtures/${id}`,
      onSuccess(data) {
        setFixtures(data)
      },
    })
    // axiosFetch({
    //   method: "get",
    //   url: `/api/data/transfers/${id}`,
    //   onSuccess(data) {
    //     setTransfers(data)
    //   },
    // })
  }, [id, season])

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/data/fixtures/${id}`,
      onSuccess(data) {
        setFixtures(data)
      },
    })

    axiosFetch({
      method: "get",
      url: `/api/data/team-standings/${id}`,
      onSuccess(data) {
        setStandings(data)
      },
    })

    if (fixtures) {
      const today = new Date()

      const upcomingFixtures = fixtures.filter((fixture: FixtureData) => {
        const fixtureDate = new Date(fixture.fixture.date)
        return fixtureDate > today
      })

      setUpcomingFixture(
        upcomingFixtures.length > 0 ? upcomingFixtures[0] : null
      )
    }

    if (standings) {
      const leagueStandings = standings.filter((entry: Entry) => {
        return entry.league.country === team?.team.country
      })

      setLeagueStandings(leagueStandings[0].league.standings[0][0])
    }
  }, [team])

  return (
    <div className="flex flex-col border-x-2 w-full h-full">
      <div className="flex sticky top-16 sm:top-0 bg-white w-full items-center p-3 gap-4 z-30">
        <HiArrowLeft
          className="hover:cursor-pointer"
          size={24}
          onClick={() => navigate(-1)}
        />
        <div className="flex flex-col">
          <span className="font-bold text-2xl">{team?.team.name}</span>
        </div>
      </div>
      <div className="flex flex-col bg-green-500 text-white">
        <div className="flex justify-between p-2">
          <div className="flex items-center gap-4">
            <img
              className="w-24 h-24 sm:w-48 sm:h-48 rounded-xl p-1"
              src={team?.team.logo}
            />

            <span className="font-bold text-4xl">{team?.team.name}</span>
          </div>
          <div className="hidden sm:flex flex-col font-bold border-2 rounded-xl p-2">
            <img className="w-48" src={team?.venue.image} />
            <span>Name: {team?.venue?.name}</span>
            <span>Capacity: {team?.venue?.capacity}</span>
            <span>City: {team?.venue?.city}</span>
          </div>
        </div>
        <div className="flex justify-center w-full gap-4">
          <span
            onClick={() => setOption("overview")}
            className={`border-x-2 border-t-2 p-2 rounded-t-xl font-bold border-b cursor-pointer ${
              option === "overview" && "bg-white text-green-500 border-b-0"
            }`}
          >
            Overview
          </span>
          <span
            onClick={() => setOption("squad")}
            className={`border-x-2 border-t-2 p-2 rounded-t-xl font-bold border-b cursor-pointer ${
              option === "squad" && "bg-white text-green-500 border-b-0"
            }`}
          >
            Squad
          </span>
          <span
            onClick={() => setOption("fixtures")}
            className={`border-x-2 border-t-2 p-2 rounded-t-xl font-bold border-b cursor-pointer ${
              option === "fixtures" && "bg-white text-green-500 border-b-0"
            }`}
          >
            Fixtures
          </span>
        </div>
      </div>

      {option === "overview" && (
        <div className="flex w-full gap-4 p-2">
          <div className="w-2/3  border rounded-xl p-2">
            <select value={season} onChange={(e) => setSeason(e.target.value)}>
              <option value="2023">2023/2024</option>
              <option value="2022">2022/2023</option>
            </select>
            {stats && <TeamStats stats={stats} />}
          </div>
          <div className="flex w-1/3">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col items-center border rounded-xl p-2">
                <span className="font-bold text-xl">Upcoming Fixture</span>
                <div className="flex gap-2">
                  <div className="flex">{upcomingFixture?.teams.home.name}</div>
                  <span>vs</span>
                  <div className="flex">{upcomingFixture?.teams.away.name}</div>
                </div>
              </div>
              <div className="flex flex-col items-center border rounded-xl p-2">
                <span className="font-bold text-xl">League Standings</span>
                <div className="flex flex-col gap-2">
                  <span>{leagueStandings?.group}</span>
                  <span>{leagueStandings?.rank}</span>
                  <span>{leagueStandings?.form}</span>
                  <span>{leagueStandings?.goalsDiff}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {option === "squad" && squad && (
        <>
          <SquadList players={squad} />
        </>
      )}
      {option === "fixtures" && fixtures && (
        <>
          <FixturesList fixtures={fixtures} />
        </>
      )}
    </div>
  )
}
