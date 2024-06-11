import { model, Schema } from "mongoose"
import bcrypt from "bcryptjs"

interface IUser {
  email: string
  username: string
  displayName: string
  password: string
  avatar?: string
  bio: string
  team: ITeam
  following: Array<Object>
  followers: Array<Object>
  followingCount: number
  followersCount: number
}

interface ITeam {
  team: number
  logo: string
  name: string
  league: number
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
    default: "Hi! I've just joined KickTalk!",
  },
  team: {
    type: Object,
    required: true,
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followingCount: {
    type: Number,
    required: true,
    default: 0,
  },
  followersCount: {
    type: Number,
    required: true,
    default: 0,
  },
})

userSchema.pre("save", async function (done) {
  if (!this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12)
  }

  done()
})

const User = model("User", userSchema)

export { User }
