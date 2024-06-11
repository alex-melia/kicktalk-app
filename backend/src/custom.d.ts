import { IUser } from "../src/models/userModel" // Adjust the path as necessary

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUser
    }
  }
}
