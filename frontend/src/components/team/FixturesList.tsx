import { useEffect, useState } from "react"
import formatFixture from "../../utils/formatFixture"
import { Link } from "react-router-dom"
import { FixtureData } from "../../types/fixture"

interface FixturesListProps {
  fixtures: FixtureData[]
}

export default function FixturesList({ fixtures }: FixturesListProps) {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [filteredFixtures, setFilteredFixtures] = useState<
    FixtureData[] | null
  >([])

  useEffect(() => {
    if (fixtures.length > 0) {
      setSelectedDate(formatDate(new Date(fixtures[0].fixture.date)))
    }
  }, [fixtures])

  useEffect(() => {
    if (selectedDate) {
      const matches = fixtures.filter(
        (fixture: FixtureData) =>
          formatDate(new Date(fixture.fixture.date)) === selectedDate
      )
      setFilteredFixtures(matches)
    }
  }, [selectedDate, fixtures])

  const formatDate = (date: Date) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  }

  const getUniqueDates = () => {
    const dateObjects = fixtures.map(
      (fixture: FixtureData) => new Date(fixture.fixture.date)
    )
    return [...new Set(dateObjects.map(formatDate))].sort((a: any, b: any) => {
      const partsA = a.split(" ")
      const partsB = b.split(" ")
      const yearDiff = partsA[1] - partsB[1]
      if (yearDiff !== 0) return yearDiff
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]
      return monthNames.indexOf(partsA[0]) - monthNames.indexOf(partsB[0])
    })
  }

  const handleDateSelection = (date: string) => {
    setSelectedDate(date)
  }

  return (
    <div className="w-full p-2">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-6 place-items-center w-full md:flex gap-4 justify-center">
          {getUniqueDates().map((date: string) => (
            <button
              key={date}
              onClick={() => handleDateSelection(date)}
              className={` font-bold border rounded-xl p-1 ${
                selectedDate === date ? "bg-green-500 text-white" : ""
              }`}
            >
              <div className="hidden sm:block text-center">{date}</div>
              <div className="block sm:hidden">{date}</div>
            </button>
          ))}
        </div>
        <div className="w-full">
          {filteredFixtures?.map((fixture: FixtureData) => (
            <div
              className="flex flex-col items-center justify-center"
              key={fixture.fixture.id}
            >
              <span className="w-full p-1 font-bold">
                {formatFixture(fixture.fixture.date)}
              </span>
              <span className="bg-gray-100 w-full p-1 font-medium text-gray-500 uppercase tracking-wider">
                {fixture.league.name}
              </span>
              <span className="mt-2">{fixture.league.round}</span>

              <Link
                to={`/fixture/${fixture.fixture.id}`}
                className="flex justify-center items-center gap-8 my-2 w-full"
              >
                <span className="flex flex-1 font-bold justify-end">
                  {fixture.teams.home.name}
                </span>
                <div className="bg-gray-100 p-1">
                  <span>{fixture.score.fulltime.home}</span>
                  <span> - </span>
                  <span>{fixture.score.fulltime.away}</span>
                </div>
                <span className="flex-1 font-bold">
                  {fixture.teams.away.name}
                </span>
              </Link>
              <span>{fixture.fixture.status?.long ?? "Status Unknown"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
