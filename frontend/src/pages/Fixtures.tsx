import { useEffect, useState } from "react"
import useAxios from "../hooks/useAxios"
import { useNavigate, useParams } from "react-router-dom"
import FixturesList from "../components/team/FixturesList"
import { HiArrowLeft } from "react-icons/hi2"
import { FixtureData } from "../types/fixture"

export default function Fixtures() {
  const { id } = useParams<string>()
  const { axiosFetch } = useAxios()

  const [fixtures, setFixtures] = useState<FixtureData[]>()

  const navigate = useNavigate()

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/data/fixtures/${id}`,
      onSuccess(data) {
        setFixtures(data)
      },
    })
  }, [])

  return (
    <div className="border-x-2 min-h-screen">
      <div className="sticky top-16 sm:top-0 w-full flex p-2 gap-4 items-center bg-white border-b-2">
        <HiArrowLeft
          className="hover:cursor-pointer"
          size={32}
          onClick={() => navigate(-1)}
        />
        <span className="font-bold text-2xl">Fixtures</span>
      </div>
      {fixtures && <FixturesList fixtures={fixtures} />}
    </div>
  )
}
