import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Search from "../common/Search"
import { CurrentUser } from "../../types"

interface NavbarProps {
  currentUser?: CurrentUser
}

export default function Navbar({ currentUser }: NavbarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
  }

  return (
    <header className="fixed w-full h-14 p-2 text-white bg-green-500 z-50">
      {currentUser ? (
        <div className="grid grid-flow-col grid-cols-[auto, 1fr, auto] max-w-7xl mx-auto items-center">
          <span
            className="text-4xl font-bold cursor-pointer max-w-12 self-center"
            onClick={() => navigate("/dashboard")}
          >
            KickTalk
          </span>
          <Search query={query} setQuery={handleQueryChange} />
        </div>
      ) : (
        <div className="flex justify-between max-w-7xl mx-auto items-center">
          <span
            className="text-4xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            KickTalk
          </span>
          <nav>
            <ul className="flex gap-12 text-xl font-semibold">
              <li className=" hover:-translate-y-0.5 hover:text-gray-200 hover:transition-all cursor-pointer">
                <a href="/#about">About</a>
              </li>
              <li
                className=" hover:-translate-y-0.5 hover:text-gray-200 hover:transition-all cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Log in
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
