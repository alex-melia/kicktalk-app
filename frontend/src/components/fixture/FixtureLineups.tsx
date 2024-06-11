import { Link } from "react-router-dom"
import { FixtureData } from "../../types/fixture"

interface FixtureLineups {
  fixture: FixtureData
}

export default function FixtureLineups({ fixture }: any) {
  const HOME_LINEUPS = fixture?.lineups[0]
  const AWAY_LINEUPS = fixture?.lineups[1]

  return (
    <>
      {fixture.lineups.length ? (
        <div className="flex flex-col items-center p-2 mb-6">
          <div className="lg:grid lg:grid-cols-3 w-full">
            <div className="flex flex-col items-center lg:items-end gap-4 mr-0  lg:mr-4">
              <div className="flex gap-4 items-center lg:justify-end">
                <div className="flex flex-col">
                  <span className="font-bold text-xl">
                    {fixture?.lineups[0].team.name}
                  </span>
                  <span className="flex justify-end">
                    {fixture?.lineups[0].formation}
                  </span>
                </div>
                <img
                  className="w-12 h-12"
                  src={fixture?.lineups[0].team.logo}
                  alt="Team photo"
                />
              </div>
              <div className="flex flex-col items-center lg:items-end gap-4">
                <div className="flex flex-col gap-2 items-end">
                  <span className="font-bold text-2xl">Goalkeeper</span>
                  <div className="flex flex-col gap-2 items-end">
                    {HOME_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "G")
                      .map((player: any, index: number) => (
                        <Link
                          to={`/player/${player.player.id}`}
                          className="flex gap-2"
                          key={index}
                        >
                          <span>{player.player.name}</span>
                          <span className="font-bold">
                            {player.player.number}
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
                <hr className="w-full" />
                <div className="flex flex-col gap-2 lg:items-end">
                  <span className="font-bold text-2xl">Defenders</span>
                  <div className="flex flex-col gap-2 items-center lg:items-end">
                    {HOME_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "D")
                      .map((player: any, index: number) => (
                        <Link
                          to={`/player/${player.player.id}`}
                          className="flex gap-2"
                          key={index}
                        >
                          <span>{player.player.name}</span>
                          <span className="font-bold">
                            {player.player.number}
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
                <hr className="w-full" />
                <div className="flex flex-col gap-2 items-center lg:items-end">
                  <span className="font-bold text-2xl">Midfielders</span>
                  <div className="flex flex-col gap-2 items-center lg:items-end">
                    {HOME_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "M")
                      .map((player: any, index: number) => (
                        <Link
                          to={`/player/${player.player.id}`}
                          className="flex gap-2"
                          key={index}
                        >
                          <span>{player.player.name}</span>
                          <span className="font-bold">
                            {player.player.number}
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
                <hr className="w-full" />
                <div className="flex flex-col gap-2 items-center lg:items-end">
                  <span className="font-bold text-2xl">Forwards</span>
                  <div className="flex flex-col gap-2 items-center lg:items-end">
                    {HOME_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "F")
                      .map((player: any, index: number) => (
                        <Link
                          to={`/player/${player.player.id}`}
                          className="flex gap-2"
                          key={index}
                        >
                          <span>{player.player.name}</span>
                          <span className="font-bold">
                            {player.player.number}
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
                <hr className="w-full" />
                <div className="flex flex-col gap-2 items-center lg:items-end">
                  <span className="font-bold text-2xl">Substitutes</span>
                  <div className="flex flex-col gap-2 items-center lg:items-end">
                    {HOME_LINEUPS?.substitutes.map(
                      (player: any, index: number) => (
                        <Link
                          to={`/player/${player.player.id}`}
                          className="flex gap-2"
                          key={index}
                        >
                          <span>{player.player.name}</span>
                          <span className="font-bold">
                            {player.player.number}
                          </span>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center pt-4">
              <div className="flex justify-center mb-4">
                <img className="w-16" src={fixture?.teams.home.logo} />
              </div>
              <div
                className="flex justify-center relative"
                style={{ width: "95%" }}
              >
                <img
                  className="block w-full z-30"
                  src="https://www.premierleague.com/resources/rebrand/v7.142.1/i/elements/lineup-pitch.jpg"
                  style={{ maxWidth: "none" }}
                />
                <div className="absolute top-0 left-0 right-0 flex flex-col justify-between h-1/2 p-6">
                  <div className="flex justify-between w-full z-30">
                    {HOME_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "G")
                      .map((player: any, index: number) => (
                        <div key={index} className="flex justify-center w-full">
                          <div className="bg-red-500 font-bold text-white text-center p-1 rounded-full min-w-8">
                            {player.player.number}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-between w-full z-30">
                    {HOME_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "D")
                      .map((player: any, index: number) => (
                        <div key={index} className="flex justify-center w-full">
                          <div className="bg-red-500 font-bold text-white text-center p-1 rounded-full min-w-8">
                            {player.player.number}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex z-30">
                    {HOME_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "M")
                      .map((player: any, index: number) => (
                        <div key={index} className="flex justify-center w-full">
                          <div className="bg-red-500 font-bold text-white text-center p-1 rounded-full min-w-8">
                            {player.player.number}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-between w-full z-30">
                    {HOME_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "F")
                      .map((player: any, index: number) => (
                        <div key={index} className="flex justify-center w-full">
                          <div className="bg-red-500 font-bold text-white text-center p-1 rounded-full min-w-8">
                            {player.player.number}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex flex-col-reverse justify-between h-1/2 p-6">
                  <div className="flex justify-between w-full z-30">
                    {AWAY_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "G")
                      .map((player: any, index: number) => (
                        <div key={index} className="flex justify-center w-full">
                          <div className="bg-blue-500 font-bold text-white text-center p-1 rounded-full min-w-8">
                            {player.player.number}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-between w-full z-30">
                    {AWAY_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "D")
                      .map((player: any, index: number) => (
                        <div key={index} className="flex justify-center w-full">
                          <div className="bg-blue-500 font-bold text-white text-center p-1 rounded-full min-w-8">
                            {player.player.number}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex z-30">
                    {AWAY_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "M")
                      .map((player: any, index: number) => (
                        <div key={index} className="flex justify-center w-full">
                          <div className="bg-blue-500 font-bold text-white text-center p-1 rounded-full min-w-8">
                            {player.player.number}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-between w-full z-30">
                    {AWAY_LINEUPS?.startXI
                      .filter((player: any) => player.player.pos === "F")
                      .map((player: any, index: number) => (
                        <div key={index} className="flex justify-center w-full">
                          <div className="bg-blue-500 font-bold text-white text-center p-1 rounded-full min-w-8">
                            {player.player.number}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <img className="w-16" src={fixture?.teams.away.logo} />
              </div>
            </div>

            <div className="flex justify-center lg:justify-start items-start lg:ml-4">
              <div className="flex flex-col items-center lg:items-start gap-4 mt-4 lg:mt-0">
                <div className="flex flex-row-reverse gap-4 items-center lg:justify-start">
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">
                      {fixture?.lineups[1].team.name}
                    </span>
                    <span className="flex justify-center lg:justify-start">
                      {fixture?.lineups[1].formation}
                    </span>
                  </div>
                  <img
                    className="w-12 h-12 lg:block hidden"
                    src={fixture?.lineups[1].team.logo}
                    alt="Team photo"
                  />
                </div>
                <div className="flex flex-col items-center lg:items-start gap-4">
                  <div className="flex flex-col gap-2 items-center lg:items-start">
                    <span className="font-bold text-2xl">Goalkeeper</span>
                    <div className="flex flex-col gap-2 items-center lg:items-start">
                      {AWAY_LINEUPS?.startXI
                        .filter((player: any) => player.player.pos === "G")
                        .map((player: any, index: number) => (
                          <Link
                            to={`/player/${player.player.id}`}
                            className="flex gap-2"
                            key={index}
                          >
                            <span className="font-bold">
                              {player.player.number}
                            </span>
                            <span>{player.player.name}</span>
                          </Link>
                        ))}
                    </div>
                  </div>
                  <hr className="w-full" />
                  <div className="flex flex-col gap-2 items-center lg:items-start">
                    <span className="font-bold text-2xl">Defenders</span>
                    <div className="flex flex-col gap-2 items-center lg:items-start">
                      {AWAY_LINEUPS?.startXI
                        .filter((player: any) => player.player.pos === "D")
                        .map((player: any, index: number) => (
                          <Link
                            to={`/player/${player.player.id}`}
                            className="flex gap-2"
                            key={index}
                          >
                            <span className="font-bold">
                              {player.player.number}
                            </span>
                            <span>{player.player.name}</span>
                          </Link>
                        ))}
                    </div>
                  </div>
                  <hr className="w-full" />
                  <div className="flex flex-col gap-2 items-center lg:items-start">
                    <span className="font-bold text-2xl">Midfielders</span>
                    <div className="flex flex-col gap-2 items-center lg:items-start">
                      {AWAY_LINEUPS?.startXI
                        .filter((player: any) => player.player.pos === "M")
                        .map((player: any, index: number) => (
                          <Link
                            to={`/player/${player.player.id}`}
                            className="flex gap-2"
                            key={index}
                          >
                            <span className="font-bold">
                              {player.player.number}
                            </span>
                            <span>{player.player.name}</span>
                          </Link>
                        ))}
                    </div>
                  </div>
                  <hr className="w-full" />
                  <div className="flex flex-col gap-2 items-center lg:items-start">
                    <span className="font-bold text-2xl">Forwards</span>
                    <div className="flex flex-col gap-2 items-center lg:items-start">
                      {AWAY_LINEUPS?.startXI
                        .filter((player: any) => player.player.pos === "F")
                        .map((player: any, index: number) => (
                          <Link
                            to={`/player/${player.player.id}`}
                            className="flex gap-2"
                            key={index}
                          >
                            <span className="font-bold">
                              {player.player.number}
                            </span>
                            <span>{player.player.name}</span>
                          </Link>
                        ))}
                    </div>
                  </div>
                  <hr className="w-full" />
                  <div className="flex flex-col gap-2 items-center lg:items-start">
                    <span className="font-bold text-2xl">Substitutes</span>
                    <div className="flex flex-col gap-2 items-center lg:items-start">
                      {AWAY_LINEUPS?.substitutes.map(
                        (player: any, index: number) => (
                          <Link
                            to={`/player/${player.player.id}`}
                            className="flex gap-2"
                            key={index}
                          >
                            <span className="font-bold">
                              {player.player.number}
                            </span>
                            <span>{player.player.name}</span>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-6">
          <span className="font-bold text-lg">
            Lineups will be available an hour before the match starts!
          </span>
        </div>
      )}
    </>
  )
}
