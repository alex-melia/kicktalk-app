import { createImage } from "./createImage"

export default async function getCroppedImg(imageSrc: string, pixelCrop: any) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return null
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Create a circular path
  ctx.beginPath()
  ctx.arc(
    pixelCrop.width / 2,
    pixelCrop.height / 2,
    Math.min(pixelCrop.width, pixelCrop.height) / 2,
    0,
    2 * Math.PI
  )
  ctx.closePath()
  ctx.clip()
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "cropped-image.png", {
          type: "image/png",
        })
        resolve(file)
      } else {
        reject(new Error("Failed to create a valid image blob."))
      }
    }, "image/png")
  })
}
