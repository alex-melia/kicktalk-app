import { useModal } from "../contexts/ModalContext"
import { Grid } from "@giphy/react-components"
import { GiphyFetch } from "@giphy/js-fetch-api"
import { useState } from "react"
import { HiXMark } from "react-icons/hi2"
import { IGif } from "@giphy/js-types"
import { SyntheticEvent } from "react"

export default function GifModal({ onSelectGif }: any) {
  const { hideModal } = useModal()
  const [query, setQuery] = useState<string>("")

  const gf = new GiphyFetch("BVp3ZlpERtiIGeWobtlrGmL5fiOys9hz")

  const fetchGifs = (offset: number) => {
    if (query) {
      return gf.search(query, {
        offset,
        sort: "relevant",
        lang: "en",
        limit: 10,
      })
    } else {
      return gf.trending({ offset, limit: 10 })
    }
  }

  const handleGifClick = (gif: IGif, event: SyntheticEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (gif && gif.images && gif.images.original && gif.images.original.url) {
      onSelectGif(gif.images.original.url)
      hideModal()
    }
  }

  return (
    <>
      <div
        onClick={() => hideModal()}
        className="cursor-pointer fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-all duration-500"
      ></div>
      <div className="fixed flex flex-col gap-4 top-1/2 left-1/2 bg-gray-200 rounded-lg shadow-lg p-8 transform z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 w-11/12 sm:w-1/2 h-3/4">
        <div className="flex items-center gap-8">
          <input
            type="text"
            className="bg-gray-100 p-2 rounded-xl w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a GIF"
          />
          <div onClick={hideModal}>
            <HiXMark className="cursor-pointer" size={48} />
          </div>
        </div>
        <div className="overflow-y-scroll">
          <div className="sm:hidden">
            <Grid
              key={query || "trending"}
              width={300}
              columns={1}
              fetchGifs={fetchGifs}
              onGifClick={handleGifClick}
            />
          </div>
          <div className="hidden sm:block">
            <Grid
              key={query || "trending"}
              width={1600}
              columns={3}
              fetchGifs={fetchGifs}
              onGifClick={handleGifClick}
            />
          </div>
        </div>
      </div>
    </>
  )
}
