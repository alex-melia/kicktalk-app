import { Time } from "../types"
import { Player } from "./player"
import { Team } from "./shared"

export interface EventData {
  assist: Player
  comments: string
  detail: string
  player: Player
  team: Team
  time: Time
  type: string
}
