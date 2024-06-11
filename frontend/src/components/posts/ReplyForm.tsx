import { FormEvent, useState } from "react"
import useAxios from "../../hooks/useAxios"
import { useAuth } from "../../contexts/AuthContext"
import { AiFillPicture } from "react-icons/ai"
import { PiGifFill } from "react-icons/pi"
import { useModal } from "../../contexts/ModalContext"

import GifModal from "../../modals/GifModal"
import { Post } from "../../types"

interface IPostData {
  post: Post
}

interface ReplyFormProps {
  post: IPostData
  onReplyPosted: (data: any) => void
}

export default function ReplyForm({ post, onReplyPosted }: ReplyFormProps) {
  const [content, setContent] = useState("")
  const [media, setMedia] = useState<(string | ArrayBuffer | null)[]>([])
  const [isClicked, setIsClicked] = useState(false)
  const { showModal } = useModal()
  const { currentUser } = useAuth()

  const { axiosFetch } = useAxios()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    axiosFetch({
      method: "put",
      url: `/api/posts/${post.post._id}`,
      requestConfig: {
        data: {
          action: "reply",
        },
      },
    })

    await axiosFetch({
      method: "post",
      url: "/api/posts/create",
      requestConfig: {
        data: {
          postType: "reply",
          replyingTo: post.post._id,
          content: content,
          media: media,
          user: currentUser?.id,
        },
      },
      onSuccess: (data) => {
        setContent(""), setMedia([])
        onReplyPosted(data)
      },
    })
  }

  function handleFileChange(e: any) {
    const file = e.target.files[0]
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

  function displayIcons() {
    setIsClicked(true)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full"
      onClick={displayIcons}
    >
      <div className="flex items-center">
        <div className="w-1/12 flex justify-center">
          <img src={currentUser?.avatar} className="w-16" />
        </div>
        <div className="w-11/12 w-full">
          <input
            type="text"
            value={content}
            className=" p-1 min-h-20 text-lg w-full"
            placeholder="Post your reply!"
            style={{ border: "none", outline: "none" }}
            onChange={(e) => setContent(e.target.value)}
          />
          {isClicked && (
            <>
              <div className="flex justify-between items-center">
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
                </div>
                <button className="bg-green-500 p-2 px-4 rounded-3xl text-white cursor-pointer font-bold">
                  Post
                </button>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                {media.map((item, index) => (
                  <img
                    key={index}
                    src={item as string}
                    alt="Selected"
                    className="w-48 max-w-36"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  )
}
