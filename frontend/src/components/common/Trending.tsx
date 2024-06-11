import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useAxios from "../../hooks/useAxios"

export default function Trending() {
  const { axiosFetch } = useAxios()

  const [trending, setTrending] = useState([])

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/data/trending`,
      onSuccess(data) {
        setTrending(data)
      },
    })
  }, [])

  return (
    <div className="flex flex-col border-2 rounded-xl">
      <span className="font-bold text-3xl p-2">Trending</span>
      <div className="flex flex-col">
        {trending.slice(0, 5).map((trend: any, i) => (
          <Link
            className="flex flex-col hover:bg-gray-100 transition ease-in-out p-1"
            to={`/search?q=${trend.value}&type=posts`}
            key={i}
          >
            <span className="font-bold text-lg">{trend.value}</span>
            <span>{trend.score} posts</span>
          </Link>
        ))}
        <Link to={"/explore"} className="p-2 hover:bg-gray-100">
          <span className="font-extrabold text-lg">Show more</span>
        </Link>
      </div>
    </div>
  )
}
