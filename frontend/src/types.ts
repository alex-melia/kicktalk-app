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

export interface Teams {
  home: Team
  away: Team
}

export interface Team {
  id: number
  logo: string
  name: string
  winner: boolean
}

export interface XIPlayer {
  id: number
  name: string
  pos: string
  grid: string
  number: string
}

export interface Player {
  id: number
  name: string
  pos: string
}

export interface League {
  id: number
  name: string
  logo: string
}

export interface Coach {
  id: number
  name: string
  photo: string
}

export interface Goals {
  home: number
  away: number
}

export interface Time {
  elapsed: number
  extra: number
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

export interface Lineups {
  coach: Coach
  formation: string
  startXI: XIPlayer[]
  substitutes: XIPlayer[]
  team: Team
}

export interface FixtureData {
  events: EventData[]
  fixture: FixtureObject
  status: Status
  teams: Teams
  goals: Goals
  score: Score
  league: League
  statistics: StatisticsData[]
  lineups: Lineups[]
}

export interface EventData {
  assist: Player
  comments: string
  detail: string
  player: Player
  team: Team
  time: Time
  type: string
}

export interface Birth {
  date: string
  place: string
  country: string
}

export interface Player {
  id: number
  name: string
  firstname: string
  lastname: string
  age: number
  birth: Birth
  nationality: string
  height: string
  weight: string
  injured: boolean
  photo: string
}

export interface Team {
  id: number
  logo: string
  name: string
}

export interface League {
  country: string
  flag: string
  id: number
  logo: string
  name: string
  season: number
}

export interface Games {
  appearences: number
  captain: boolean
  lineups: number
  minutes: number
  position: string
  rating: string
}

export interface Goals {
  assists: number
  conceded: number
  saves: number
  total: number
}

export interface Cards {
  yellow: number
  yellowred: number
  red: number
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
}

export interface Trophies {
  country: string
  league: string
  place: string
  season: string
  count?: number
}

export interface TransferTeam {
  in: Team
  out: Team
}

export interface Transfer {
  date: string
  teams: TransferTeam
  type: string
}

export interface Transfers {
  player: Player
  transfers: Transfer[]
}

export interface PlayerData {
  player: Player
  statistics: Statistics[]
  trophies: Trophies[]
  transfers: Transfers
}

export interface TrophyCount {
  [key: string]: Trophies & { count: number }
}

export interface User {
  _id: string
  displayName: string
  username: string
  avatar: string
  email: string
  bio: string
  followersCount: number
  followingCount: number
}

export interface CurrentUser {
  id: string
  bio: string
  firstName: string
  lastName: string
  role: string
  email: string
  displayName: string
  avatar: string
  username: string
  team: ITeam
  iat: number
}

export interface PostFixture {
  id: string
  home: string
  away: string
}

export interface Post {
  _id: string
  user: User
  content: string
  postType: string
  media: string
  createdAt: string
  isLiked: boolean
  replyingTo: Post
  likeCount: number
  replyCount: number
  repostCount: number
  likedBy: string[]
  repliedBy: string[]
  repostedBy: string[]
  isRepost?: boolean
  fixture?: PostFixture
}

export interface ITeam {
  id: number
  name: string
  logo: string
  league: number
}
