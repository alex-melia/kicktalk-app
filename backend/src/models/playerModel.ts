import { model, Schema } from "mongoose"

interface IPlayer {
  id: String
  name: String
  firstname: String
  lastname: String
  age: Number
  nationality: String
  image: String
}

const playerSchema = new Schema<IPlayer>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
  },
  nationality: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
})

const Player = model("Player", playerSchema)

export { Player }
