import { Cards, Games, Goals } from "../types"
import { League, Team } from "./shared"

interface Birth {
  date: string
  place: string
  country: string
}

export interface Player {
  id: number
  name: string
  image: string
  firstname: string
  lastname: string
  age: number
  birth: Birth
  nationality: string
  height: string
  weight: string
  injured: boolean
  photo: string
  pos: string
}

export interface Statistics {
  team: Team
  league: League
  games: Games
  substitutes: Object
  shots: Object
  goals: Goals
  passes: Object
  tackles: Object
  duels: Object
  dribbles: Object
  fouls: Object
  cards: Cards
  penalty: Object
  type: string
  value: number | string
}

interface Trophies {
  country: string
  league: string
  place: string
  season: string
  count?: number
}

interface TransferTeam {
  in: Team
  out: Team
}

interface Transfer {
  date: string
  teams: TransferTeam
  type: string
}

interface Transfers {
  player: Player
  transfers: Transfer[]
}

export interface PlayerData {
  player: Player
  statistics: Statistics[]
  trophies: Trophies[]
  transfers: Transfers
}
