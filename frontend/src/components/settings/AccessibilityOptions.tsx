import { HiArrowRight, HiOutlineSun } from "react-icons/hi2"
import { Link } from "react-router-dom"

export default function AccessibilityOptions() {
  return (
    <>
      <div className="flex flex-col mb-4 p-4">
        <span className="font-bold text-3xl">Accessibility</span>
        <span className="text-lg mt-6 mx-2">Dark/Light mode</span>
      </div>
      <div className="flex flex-col gap-4">
        <Link
          to={"/settings/your_data/account"}
          className="flex justify-between hover:bg-gray-100 hover:cursor-pointer items-center items-center p-2"
        >
          <div className="flex items-center">
            <HiOutlineSun className="mx-6" size={24} />
            <div className="flex flex-col">
              <span className="font-bold text-xl">Dark/Light Mode</span>
              <span className="text-md">
                Switch to either dark or light mode
              </span>
            </div>
          </div>
          <HiArrowRight size={24} />
        </Link>
      </div>
    </>
  )
}
