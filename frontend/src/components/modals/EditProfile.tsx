import { HiXMark } from "react-icons/hi2"
import { useModal } from "../../contexts/ModalContext"
import { useRef, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import useAxios from "../../hooks/useAxios"
import AvatarModal from "../../modals/AvatarModal"

export default function EditProfile() {
  const { showModal, hideModal } = useModal()
  const { currentUser } = useAuth()
  const { axiosFetch } = useAxios()

  const [displayName, setDisplayName] = useState(currentUser?.displayName)
  const [bio, setBio] = useState(currentUser?.bio)
  const [avatar, setAvatar] = useState("")
  const [croppedAvatar, setCroppedAvatar] = useState<any>(null)

  const saveProfile = () => {
    axiosFetch({
      method: "put",
      url: `/api/users/${currentUser?.id}`,
      requestConfig: {
        data: {
          type: "profile",
          data: {
            displayName: displayName,
            bio: bio,
            avatar: croppedAvatar,
          },
        },
      },
      onSuccess: () => {
        window.location.reload()
      },
    })
  }

  function handleFileChange(e: any) {
    const imageFiles = e.target.files
    const imageFilesLength = imageFiles.length

    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0])
      setAvatar(imageSrc)
      showModal(
        <AvatarModal
          avatar={imageSrc}
          onClose={() => hideModal()}
          onComplete={handleCropComplete}
        />
      )
      console.log(avatar)
    }
  }

  function handleCropComplete(croppedImage: any) {
    setAvatar(croppedImage)
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setCroppedAvatar(dataUrl)
    }
    reader.readAsDataURL(croppedImage)
  }

  const fileInputRef = useRef<any>(null)

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-100/50 z-30 flex justify-center"
        onClick={hideModal}
      ></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white z-40 w-11/12 sm:w-1/4 h-11/12 sm:h-1/3 rounded-xl p-2">
        <div className="flex justify-between w-full p-2">
          <HiXMark
            size={32}
            className="hover:cursor-pointer"
            onClick={hideModal}
          />
          <span className="font-bold text-3xl">Edit Profile</span>
          <span
            className="flex items-center bg-green-500 font-bold text-white text-xl p-2 rounded-full hover:cursor-pointer"
            onClick={saveProfile}
          >
            Save
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <input
            className="rounded-lg p-1"
            id="avatar"
            type="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div onClick={handleImageClick} className="cursor-pointer w-32">
            {croppedAvatar ? (
              <img src={croppedAvatar} />
            ) : (
              <img src={currentUser?.avatar} />
            )}
          </div>
          {/* <img src={currentUser?.avatar} className="w-32" /> */}

          <div className="flex flex-col">
            <span className="text-2xl">Name</span>
            <input
              className="border-2 text-xl"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl">Bio</span>
            <input
              className="border-2 text-xl min-h-24 text-start"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
