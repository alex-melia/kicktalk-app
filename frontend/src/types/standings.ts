import { Team } from "./shared"

interface Goals {
  for: number
  against: number
}

interface Games {
  played: number
  win: number
  draw: number
  lose: number
  goals: Goals
}

export interface LeagueRank {
  all: Games
  rank: number
  points: number
  goalsDiff: number
  team: Team
}

export interface LeagueData {
  id: number
  name: string
  country: string
  flag?: string
  logo: string
  season?: number
  standings: LeagueRank[][]
}

export interface Standings {
  league: LeagueData
}

export interface LeagueR {
  all: Games
  home: Games
  away: Games
  description: string
  form: string
  goalsDiff: number
  group: string
  rank: number
  status: string
  team: Team
  points: number
}

export type TeamStandings = {
  league: Standings
}[]
