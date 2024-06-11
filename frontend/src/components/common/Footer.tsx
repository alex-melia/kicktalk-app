export default function Footer() {
  return (
    <div className="bg-gray-100 p-4 sm:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between w-full">
          <a href="/">
            <span className="text-green-500 font-bold text-4xl cursor-pointer">
              KickTalk
            </span>
          </a>
          <a href="#about">
            <span className="font-bold text-xl">About</span>
          </a>
          <span className="font-bold text-xl cursor-pointer">
            Privacy Policy
          </span>
          <span className="font-bold text-xl cursor-pointer">T&Cs</span>
        </div>
      </div>
    </div>
  )
}
