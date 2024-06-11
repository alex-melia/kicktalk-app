import Navbar from "../navbar/Navbar"

import { useAuth } from "../../contexts/AuthContext"

export default function Header() {
  const { currentUser } = useAuth()
  return (
    <header className="fixed flex justify-between">
      {currentUser && <Navbar currentUser={currentUser} />}
    </header>
  )
}
