import { Link } from "react-router-dom"
import formatFixture from "../../utils/formatFixture"
import { TodayFixture } from "../../types/fixture"

interface TodaysFixturesProps {
  fixtures: TodayFixture[][] | null
}

export default function TodaysFixtures({ fixtures }: TodaysFixturesProps) {
  return (
    <div className="flex flex-col gap-4 p-2">
      {fixtures?.length ? (
        fixtures?.map((fixtureGroup: any) =>
          fixtureGroup.map((fixtureDetail: any) => (
            <Link
              to={`/event/${fixtureDetail.fixture.id}`}
              className="flex w-full gap-4"
              key={fixtureDetail.fixture.id}
            >
              <div className="flex flex-col w-full gap-2">
                <span className="font-bold text-2xl">
                  {fixtureDetail.league.name}
                </span>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center p-2 border rounded-xl">
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col items-center">
                        <img
                          className="w-12"
                          src={fixtureDetail.teams.home.logo}
                          alt={`${fixtureDetail.teams.home.name} logo`}
                        />
                        <span className="font-bold">
                          {fixtureDetail.teams.home.name}
                        </span>
                      </div>
                      <span>vs.</span>
                      <div className="flex flex-col items-center">
                        <img
                          className="w-12"
                          src={fixtureDetail.teams.away.logo}
                          alt={`${fixtureDetail.teams.away.name} logo`}
                        />
                        <span className="font-bold">
                          {fixtureDetail.teams.away.name}
                        </span>
                      </div>
                    </div>
                    <span>{formatFixture(fixtureDetail.fixture.date)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )
      ) : (
        <p className="text-center font-semibold text-lg mt-4">
          No matches today
        </p>
      )}
    </div>
  )
}
