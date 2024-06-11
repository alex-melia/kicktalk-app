import { ChangeEvent, useState } from "react"
import Cropper from "react-easy-crop"

import { HiXMark } from "react-icons/hi2"

import getCroppedImg from "../utils/getCroppedImg"

// interface AvatarModalProps {
//   avatar: string
//   onClose: any
//   onComplete: any
// }

export default function AvatarModal({ avatar, onClose, onComplete }: any) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [croppedImage, setCroppedImage] = useState<any>(null)

  // const onCropComplete = (croppedAreaPixels: any) => {
  //   setCroppedAreaPixels(croppedAreaPixels)
  // }
  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const showCroppedImage = async () => {
    const circleSize = Math.min(
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    // Calculate the offset to create a perfect circle
    const xOffset = (croppedAreaPixels.width - circleSize) / 2
    const yOffset = (croppedAreaPixels.height - circleSize) / 2

    const circularCroppedAreaPixels = {
      x: croppedAreaPixels.x + xOffset,
      y: croppedAreaPixels.y + yOffset,
      width: circleSize,
      height: circleSize,
    }

    try {
      const croppedImage = await getCroppedImg(
        avatar,
        circularCroppedAreaPixels
      )
      setCroppedImage(croppedImage)
      onComplete(croppedImage)
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-all duration-500">
      <div className="fixed top-1/2 left-1/2 bg-gray-200 rounded-lg shadow-lg p-8 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 w-1/2 h-1/2">
        <div className="absolute inset-0 mb-20">
          <Cropper
            image={avatar}
            crop={crop}
            zoom={zoom}
            showGrid={false}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round"
          />
        </div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setZoom(parseFloat(e.target.value))
            }}
          />
          <img src={croppedImage} />
          <button onClick={showCroppedImage}>Save</button>
          <HiXMark onClick={() => onClose()} />
        </div>
      </div>
    </div>
  )
}
