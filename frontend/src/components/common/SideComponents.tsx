import { useState } from "react"
import SearchBar from "./Search"
import Trending from "./Trending"
import UsersToFollow from "./UsersToFollow"

export default function SideComponents() {
  const [query, setQuery] = useState<string>("")

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
  }
  return (
    <div className="hidden lg:block md:w-4/12 flex justify-start mt-6 md:w-4/12">
      <div className="sticky top-0 flex flex-col gap-5 mr-4">
        <SearchBar query={query} setQuery={handleQueryChange} />
        <Trending />
        <UsersToFollow />
      </div>
    </div>
  )
}
