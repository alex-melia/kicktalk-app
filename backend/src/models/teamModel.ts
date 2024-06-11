import { model, Schema } from "mongoose"

interface ITeam {
  id: String
  name: String
  country: String
  logo: String
}

const teamSchema = new Schema<ITeam>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
})

const Team = model("Team", teamSchema)

export { Team }
