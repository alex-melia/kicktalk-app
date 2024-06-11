import { FormEvent, useEffect, useState } from "react"
import useAxios from "../../hooks/useAxios"
import { useAuth } from "../../contexts/AuthContext"
import { AiFillPicture } from "react-icons/ai"
import { PiGifFill } from "react-icons/pi"
import { useModal } from "../../contexts/ModalContext"

import GifModal from "../../modals/GifModal"
import Loading from "../common/Loading"

export default function PostForm({ onNewPost }: any) {
  const [content, setContent] = useState("")
  const [media, setMedia] = useState<(string | ArrayBuffer | null)[]>([])
  const [fixture, setFixture] = useState<any>(null)
  const [fixtureDropdown, showFixtureDropdown] = useState(false)
  const { showModal } = useModal()
  const { currentUser } = useAuth()

  const [todaysFixtures, setTodaysFixtures] = useState([])

  const { loading, axiosFetch } = useAxios()

  useEffect(() => {
    axiosFetch({
      method: "get",
      url: `/api/data/todays-fixtures`,
      onSuccess(data) {
        setTodaysFixtures(data)
      },
    })
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    await axiosFetch({
      method: "post",
      url: "/api/posts/create",
      requestConfig: {
        data: {
          postType: "post",
          content,
          media,
          fixture: {
            id: fixture?.fixture.id,
            home: fixture?.teams.home.name,
            away: fixture?.teams.away.name,
          },
          user: currentUser?.id,
        },
      },
      onSuccess: (data) => {
        if (onNewPost) {
          onNewPost(data)
        }

        setContent("")
        setMedia([])
      },
    })
  }

  function handleFileChange(e: any) {
    const file = e.target.files[0] // Get the first file
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMedia((prevMedia) => [...prevMedia, reader.result])
      }
      reader.readAsDataURL(file)
    }
  }

  function handleSelectGif(gifUrl: string) {
    setMedia((prevMedia) => [...prevMedia, gifUrl])
  }

  console.log(media)

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col border-b-2 p-2 w-full"
    >
      <input
        type="text"
        value={content}
        className="border p-1 min-h-20"
        placeholder="Write something here!"
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-between p-2 items-center">
        <div className="flex items-center gap-2">
          <div
            className="hover:bg-green-400 hover:cursor-pointer p-1 rounded-full transition"
            onClick={() =>
              showModal(<GifModal onSelectGif={handleSelectGif} />)
            }
          >
            <PiGifFill size={24} />
          </div>

          <label
            className="hover:bg-green-400 hover:cursor-pointer p-1 rounded-full transition"
            htmlFor="media"
          >
            <AiFillPicture size={24} />
          </label>
          <input
            multiple
            className="hover:bg-green-400 hover:cursor-pointer p-1 rounded-full transition"
            id="media"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div className="relative" style={{ display: "inline-block" }}>
            {fixture ? (
              <>
                <span
                  onClick={() => showFixtureDropdown(true)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  className="bg-green-500 text-white font-bold p-1 rounded-xl"
                >
                  {fixture.teams.home.name} vs {fixture.teams.away.name}
                </span>
              </>
            ) : (
              <>
                <span
                  onClick={() => showFixtureDropdown(true)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Fixture
                </span>
              </>
            )}
            {fixtureDropdown && (
              <div
                onMouseLeave={() => showFixtureDropdown(false)}
                className="absolute z-50 left-0 mt-1 w-96 -translate-x-1/2 bg-gray-100 border-4 border-green-500 rounded-3xl p-2 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-center font-bold mb-2">
                    Today's Fixtures
                  </span>

                  <div className="flex flex-col gap-4 p-2 max-h-44 overflow-y-auto border-2 p-2 rounded-xl">
                    {todaysFixtures.map((fixtureGroup: any) =>
                      fixtureGroup.map((fixtureDetail: any) => (
                        <div
                          className="flex w-full gap-4"
                          key={fixtureDetail.fixture.id}
                          onClick={() => {
                            setFixture(fixtureDetail)
                            showFixtureDropdown(false)
                          }}
                        >
                          <div className="flex flex-col w-full gap-2">
                            <span className="font-bold text-2xl">
                              {fixtureDetail.league.name}
                            </span>

                            <div className="flex gap-4 items-center p-2 rounded-xl w-full">
                              <div className="grid grid-cols-2 place-items-center w-full">
                                <div className="flex gap-2 bg-green-500 p-1 rounded-xl text-white font-bold">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold">
                                      {fixtureDetail.teams.home.name}
                                    </span>
                                  </div>
                                  <span>vs.</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold">
                                      {fixtureDetail.teams.away.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          className={`${
            loading && `disabled`
          } bg-green-500 p-2 px-4 rounded-3xl text-white cursor-pointer font-bold`}
        >
          {loading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : (
            <span>Post</span>
          )}
        </button>
      </div>
      <div className="grid grid-cols-4 items-center gap-2">
        {media &&
          media.map((item, index) => (
            <img
              key={index}
              src={item as string}
              alt="Selected"
              className="w-48 max-w-36"
            />
          ))}
      </div>
    </form>
  )
}
