import { FormEvent, useEffect, useRef, useState } from "react"
import { useModal } from "../contexts/ModalContext"
import { useAuth } from "../contexts/AuthContext"
import useAxios from "../hooks/useAxios"
import { PiGifFill } from "react-icons/pi"
import GifModal from "./GifModal"
import { HiXMark } from "react-icons/hi2"
import { FixtureData } from "../types/fixture"

export default function PostModal() {
  const [content, setContent] = useState("")
  const [media, setMedia] = useState<(string | ArrayBuffer | null)[]>([])
  const [fixture, setFixture] = useState<FixtureData | null>(null)
  const [fixtureDropdown, showFixtureDropdown] = useState(false)
  const { showModal, hideModal } = useModal()
  const { currentUser } = useAuth()

  const [todaysFixtures, setTodaysFixtures] = useState([])

  const { axiosFetch } = useAxios()

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
      onSuccess: () => {
        setContent(""), setMedia([])
        hideModal()
      },
    })
  }

  function handleSelectGif(gifUrl: string) {
    setMedia((prevMedia) => [...prevMedia, gifUrl])
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  console.log(media)

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-100/90 z-30 flex justify-center z-50"
        onClick={hideModal}
      ></div>
      <div className="border-2 shadow-lg fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white z-40 w-11/12 sm:w-1/4 min-h-[200px] rounded-xl p-2 z-50 max-h-[1200px]">
        <div className="flex w-full justify-end">
          <HiXMark
            className="cursor-pointer"
            onClick={() => hideModal()}
            size={32}
          />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col h-full w-full">
          <textarea
            ref={textareaRef}
            value={content}
            className="text-2xl p-1  mb-2 max-h-[400px] overflow-y-scroll"
            placeholder="Write something here!"
            onChange={(e) => setContent(e.target.value)}
          />
          {media.length > 0 && (
            <div className="flex gap-2 w-full h-60 overflow-x-scroll mb-16">
              {media.map((item, index) => (
                <img
                  key={index}
                  src={item as string}
                  alt="Selected"
                  className="h-full"
                />
              ))}
            </div>
          )}

          <div className="fixed bottom-0 flex justify-between w-full p-4 items-center border-y">
            <div className="flex items-center gap-2">
              <span>Emoji</span>

              <div
                className="hover:bg-green-400 hover:cursor-pointer p-1 rounded-full transition"
                onClick={() =>
                  showModal(<GifModal onSelectGif={handleSelectGif} />)
                }
              >
                <PiGifFill size={24} />
              </div>
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
            <button className="bg-green-500 p-2 px-4 rounded-3xl text-white cursor-pointer font-bold">
              Post
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
