import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { HiArrowLeft } from "react-icons/hi2"
import { Post } from "../types"
import { Player } from "../types/player"
import { Team } from "../types/shared"

import useAxios from "../hooks/useAxios"
import PostList from "../components/posts/PostList"
import SearchBar from "../components/common/Search"

type SearchResult = Player[] | Team[] | Post[]

export default function Search() {
  const { axiosFetch } = useAxios()
  const [searchParams] = useSearchParams()
  const q = searchParams.get("q")
  const type = searchParams.get("type")

  const [results, setResults] = useState<SearchResult>()
  const [resultsType, setResultsType] = useState<string | null>("")

  const navigate = useNavigate()

  const [query, setQuery] = useState("")

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
  }

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/data/search/${type}/${q}`,
      onSuccess(data) {
        console.log(data)
        setResults(data.results)
        setResultsType(data.type)
      },
    })
  }, [q, type])

  return (
    <div className="flex flex-col w-full border-x-2 min-h-screen h-full">
      <div className="sticky top-0 w-full flex p-2 gap-4 items-center bg-white border-b-2">
        <HiArrowLeft
          className="hover:cursor-pointer"
          size={32}
          onClick={() => navigate(-1)}
        />
        <span className="font-bold text-2xl">Search</span>
      </div>
      <div className="sm:top-16 top-0 w-full">
        <SearchBar query={query} setQuery={handleQueryChange} />
      </div>
      {results && results.length > 0 ? (
        <span className="font-medium text-xl p-2 border-b-2">
          Showing results for '{q}':
        </span>
      ) : (
        <span className="font-medium text-xl p-2 border-b">
          There are no results for '{q}'
        </span>
      )}

      {results && resultsType === "players" && (
        <div className="flex flex-col">
          {(results as Player[]).map((player, i) => (
            <div key={i} className="p-2 border-b ">
              <Link
                to={`/player/${player.id}`}
                className="flex p-2 gap-4 items-center hover:bg-gray-100 transition ease-in-out"
              >
                <img className="w-24" src={player.image} alt="Player image" />
                <div className="flex flex-col">
                  <span className="font-bold">{player.name}</span>
                  <span>Age: {player.age}</span>
                  <span>Nationality: {player.nationality}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      {results &&
        resultsType === "teams" &&
        (results as Team[]).map((team, i) => (
          <div className="p-2 border rounded-xl shadow-xl">
            <Link
              to={`/team/${team.id}`}
              key={i}
              className="flex p-2 gap-4 items-center hover:bg-gray-100 transition ease-in-out"
            >
              <img className="w-24" src={team.logo} alt="Team logo" />
              <div className="flex flex-col">
                <span className="font-bold">{team.name}</span>
                <span>Country: {team.country}</span>
              </div>
            </Link>
          </div>
        ))}
      {results && resultsType === "posts" && (
        <PostList posts={results as Post[]} />
      )}
    </div>
  )
}
