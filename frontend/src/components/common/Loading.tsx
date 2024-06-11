import { RotatingLines } from "react-loader-spinner"

export default function Loading() {
  return (
    <RotatingLines
      strokeColor="green"
      strokeWidth="5"
      animationDuration="0.75"
      width="32"
      visible={true}
    />
  )
}
