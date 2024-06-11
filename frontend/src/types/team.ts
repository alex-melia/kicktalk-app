import { League, Team } from "./shared"

interface Penalty {
  missed: object
  scored: object
  total: number
}

interface Goals {
  for: {
    home: number
    away: number
    total: number
  }
  against: {
    home: number
    away: number
    total: number
  }
}

interface Fixtures {
  draws: {
    home: number
    away: number
    total: number
  }
  loses: {
    home: number
    away: number
    total: number
  }
  played: {
    home: number
    away: number
    total: number
  }
  wins: {
    home: number
    away: number
    total: number
  }
}

export interface TeamStats {
  fixtures: Fixtures
  form: string
  goals: Goals
  league: League
  penalty: Penalty
  team: Team
}
