import { IoIosFootball } from "react-icons/io"
import { FixtureData } from "../../types/fixture"

interface FixtureEventsProps {
  fixture: FixtureData
  team: "home" | "away"
}

export default function FixtureEvents({ fixture, team }: FixtureEventsProps) {
  return (
    <div className="flex flex-col gap-2 justify-end">
      {fixture?.events &&
        fixture.events.length > 0 &&
        fixture.events
          .filter(
            (event: any) =>
              event.type === "Goal" && event.team.id === fixture?.teams[team].id
          )
          .map((event: any, i: number) => (
            <div
              key={i}
              className={`flex flex-col text-xl ${
                team === "home" && "items-end"
              } ${team === "away" && "justify-end"}`}
            >
              <div className="flex items-center gap-2">
                {event.detail === "Normal Goal" ? (
                  <>
                    <span>{event.time.elapsed}'</span>
                    <IoIosFootball />
                  </>
                ) : (
                  <>
                    <span>{event.time.elapsed}'</span>
                    <IoIosFootball fill="red" />
                  </>
                )}
              </div>
              <span>{event.player.name}</span>
            </div>
          ))}
    </div>
  )
}
