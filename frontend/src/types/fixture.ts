import { League, Status, Venue, Lineups, Team } from "./shared"
import { EventData } from "./event"

export interface FixtureObject {
  id: number
  date: string
  referee: string
  leauge: League
  status: Status
  timestamp: number
  venue: Venue
  lineups: Lineups[]
}

// export interface Teams {
//   home: Team
//   away: Team
// }

export interface Goals {
  home: number
  away: number
}

export interface HalfTime {
  home: number
  away: number
}

export interface Score {
  fulltime: HalfTime
  halftime: HalfTime
}

export interface Statistics {
  type: string
  value: number | string
}

export interface StatisticsData {
  statistics: Statistics[]
  team: Team
}

export interface FixtureData {
  events: EventData[]
  fixture: FixtureObject
  status: Status
  teams: {
    home: Team
    away: Team
  }
  goals: Goals
  score: Score
  league: League
  statistics: StatisticsData[]
  lineups: Lineups[]
}

export interface TodayFixture {
  fixture: FixtureObject
  league: League
  teams: {
    home: Team
    away: Team
  }
  goals: Goals
  score: Score
}
