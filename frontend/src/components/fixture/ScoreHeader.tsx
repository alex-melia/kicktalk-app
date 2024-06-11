import { FixtureData } from "../../types/fixture"
import FixtureEvents from "./FixtureEvents"

interface ScoreHeaderProps {
  fixture: FixtureData
}

export default function ScoreHeader({ fixture }: ScoreHeaderProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center items-center w-full">
        <div className="grow w-1/3">
          <div className="flex flex-col flex-col-reverse sm:flex-row text-center items-center sm:justify-end gap-2 sm:gap-4 md:gap-8">
            <span className="text-lg">{fixture?.teams.home.name}</span>
            <img
              className="w-10 sm:w-16"
              src={fixture?.teams.home.logo}
              alt="Team logo"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-5 gap-2">
          <span className="text-2xl sm:text-4xl">
            {fixture?.goals.home} - {fixture?.goals.away}
          </span>
        </div>

        <div className="grow w-1/3">
          <div className="flex flex-col sm:flex-row items-center justify-start gap-2 sm:gap-4 md:gap-8">
            <img
              className="w-10 sm:w-16"
              src={fixture?.teams.away.logo}
              alt="Team logo"
            />
            <span className="text-lg">{fixture?.teams.away.name}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 place-items-center gap-4 mb-4">
        <FixtureEvents fixture={fixture} team="home" />
        {fixture?.score?.halftime && fixture?.fixture.status.short !== "1H" && (
          <span className="text-lg sm:text-xl">
            HT: {fixture.score.halftime.home} - {fixture.score.halftime.away}{" "}
          </span>
        )}
        <FixtureEvents fixture={fixture} team="away" />
      </div>
    </div>
  )
}
