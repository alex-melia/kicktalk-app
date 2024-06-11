import { Coach, Post, User, XIPlayer } from "../types"

export interface League {
  id: number
  name: string
  logo: string
  country: string
  season: number
  flag: string
  round?: string
}

export interface Venue {
  id: number
  city: string
  name: string
}

export interface Status {
  elapsed: string
  short: string
  long: string
}

export interface Team {
  id: number
  logo: string
  name: string
  country?: string
}

export interface Lineups {
  coach: Coach
  formation: string
  startXI: XIPlayer[]
  substitutes: XIPlayer[]
  team: Team
}

export interface Notification {
  type: string
  contentType?: string
  post?: Post
  read: boolean
  from: User
  to: User
}

export interface Comment {
  _id: string
  commentType: string
  user: User
  content: string
  fixtureId: string
  playerId: string
  fixtureMinute: number
  upvotes: string[]
  downvotes: string[]
  voteCount: number
  createdAt: string
}
