import { useEffect, useRef, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom"

interface SearchBarProps {
  query: string
  setQuery: (e: string) => void
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  // const [isInputFocused, setIsInputFocused] = useState(false)
  const [showDropdown, setShowDropdown] = useState(true)
  const searchRef = useRef<HTMLDivElement>(null)

  const handleInputFocus = () => {
    if (query) {
      setShowDropdown(true)
    }
  }

  // const handleInputBlur = () => {
  //   setIsInputFocused(false)
  // }

  const handleClickOutside = (event: Event) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <div className="bg-white w-full p-2 z-30">
        <div
          ref={searchRef}
          className="relative flex gap-2 items-center bg-green-400 p-2 rounded-3xl w-full"
        >
          <FaSearch />
          <input
            className="bg-transparent outline-none border-none text-white placeholder-white w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            onFocus={handleInputFocus}
            // onBlur={handleInputBlur}
          />
          {query && showDropdown && (
            <div className="absolute top-10 translate-y-0.5 left-0 z-40 rounded-3xl w-full bg-gray-200 p-4">
              {/* Content of the absolute div */}
              <Link
                className="flex flex-col hover:bg-gray-300 rounded-xl transition ease-in-out p-1 border-b"
                onClick={() => setShowDropdown(false)}
                to={`/search?q=${query}&type=players`}
              >
                <span className="font-bold">
                  Search for {query} in Players...
                </span>
              </Link>
              <Link
                className="flex flex-col hover:bg-gray-300 rounded-xl transition ease-in-out p-1 border-b"
                onClick={() => setShowDropdown(false)}
                to={`/search?q=${query}&type=users`}
              >
                <span className="font-bold">
                  Search for {query} in Users...
                </span>
              </Link>
              <Link
                className="flex flex-col hover:bg-gray-300 rounded-xl transition ease-in-out p-1 border-b"
                onClick={() => setShowDropdown(false)}
                to={`/search?q=${query}&type=posts`}
              >
                <span className="font-bold">
                  Search for {query} in Posts...
                </span>
              </Link>
              <Link
                onClick={() => setShowDropdown(false)}
                to={`/search?q=${query}&type=teams`}
                className="flex flex-col hover:bg-gray-300 rounded-xl transition ease-in-out p-1 border-b"
              >
                <span className="font-bold">
                  Search for {query} in Teams...
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
