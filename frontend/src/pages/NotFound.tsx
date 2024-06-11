import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="w-full border-x min-h-screen h-full">
      <div className="flex flex-col items-center gap-6 mt-48">
        <p className="font-bold text-5xl">404</p>
        <p className="text-center text-2xl font-semibold">Page Not Found</p>
        <p
          className="text-xl bg-green-500 text-white font-bold p-2 rounded-xl"
          onClick={() => navigate("/dashboard")}
        >
          Return to Home
        </p>
      </div>
    </div>
  )
}
