import trent from "../assets/trent.png"
import chatimg from "../assets/chatimg.png"
import fixtureimg from "../assets/fixtureimg.png"
import { useNavigate, Link } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"

import { GiChatBubble } from "react-icons/gi"
import { FaDatabase, FaHeart } from "react-icons/fa"
import { FaPeopleGroup } from "react-icons/fa6"

export default function Home() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  if (currentUser) navigate("/dashboard")
  return (
    <div className="">
      <section className="text-green-500 max-w-7xl mx-auto">
        <div className="md:grid grid-cols-2 justify-center gap-24 pt-16 px-12 w-full">
          <div className="flex flex-col justify-center items-center gap-6 w-full">
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-center">
              Connect with fans anywhere, anytime!
            </span>
            <span className="md:text-2xl text-xl text-center">
              Unleash your football passion, connect with fans worldwide, and
              celebrate the beautiful game!
            </span>
            <Link
              to={"/login"}
              className="bg-green-500 text-2xl text-white mx-auto p-2 rounded-lg mb-4"
            >
              Get started
            </Link>
            <img src={trent} className="w-44 h-64 md:hidden" alt="Trent" />
          </div>
          <img src={trent} className="hidden md:block" alt="Trent" />
        </div>
      </section>
      <section
        className="bg-green-500 mx-auto text-white text-center p-4 sm:p-12 w-full"
        id="about"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-3xl sm:text-5xl font-bold">
                The Ultimate Football Community
              </span>
              <span className="text-lg sm:text-xl">
                Chat with fans, share your thoughts, and stay up to date with
                your team!
              </span>
            </div>
            <div className="flex flex-col md:grid grid-cols-2 grid-flow-auto mt-4 gap-8 md:gap-12">
              <div className="flex md:grid grid-rows-2 place-items-center gap-6">
                <div className="flex items-center justify-center gap-4">
                  <FaPeopleGroup className="w-12 h-12" />
                  <span className="hidden md:block text-2xl font-extrabold">
                    Large Community
                  </span>
                </div>
                <div className="flex flex-col text-center gap-2 sm:gap-0">
                  <span className="md:hidden text-2xl font-extrabold">
                    Large Community
                  </span>
                  <span className="text-lg sm:text-2xl font-light">
                    Thousands of fans use KickTalk to connect with each other
                    and share insight
                  </span>
                </div>
              </div>
              <div className="flex md:grid grid-rows-2 place-items-center gap-6">
                <div className="flex items-center justify-center gap-4">
                  <GiChatBubble className="w-12 h-12" />
                  <span className="hidden md:block text-2xl font-extrabold">
                    Chat and Connect
                  </span>
                </div>
                <div className="flex flex-col text-center gap-2 sm:gap-0">
                  <span className="md:hidden text-2xl font-extrabold">
                    Chat and Connect
                  </span>
                  <span className="text-lg sm:text-2xl font-light">
                    Chat with other fans through our lightning fast messaging
                    feature
                  </span>
                </div>
              </div>
              <div className="flex md:grid grid-rows-2 place-items-center gap-6">
                <div className="flex items-center justify-center gap-4">
                  <FaDatabase className="w-12 h-12" />
                  <span className="hidden md:block text-2xl font-extrabold">
                    Explore Stats and Visualise Data
                  </span>
                </div>
                <div className="flex flex-col text-center gap-2 sm:gap-0">
                  <span className="md:hidden text-2xl font-extrabold">
                    Explore Stats and Visualise Data
                  </span>
                  <span className="text-lg sm:text-2xl font-light">
                    View your teams stats and data, search for players and teams
                  </span>
                </div>
              </div>
              <div className="flex md:grid grid-rows-2 place-items-center gap-6">
                <div className="flex items-center justify-center gap-4">
                  <FaHeart className="w-12 h-12" />
                  <span className="hidden md:block text-2xl font-extrabold">
                    Create, Like, Share
                  </span>
                </div>
                <div className="flex flex-col text-center">
                  <span className="md:hidden text-2xl font-extrabold">
                    Create, Like, Share
                  </span>
                  <span className="text-lg sm:text-2xl font-light">
                    Create posts and share your thoughts and insights with the
                    community. Like, reply or repost posts to share them!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-100 mx-auto text-green-500 text-center p-4 md:p-12 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:grid grid-cols-2 place-items-center my-12 gap-8">
            <img
              src={chatimg}
              className="w-[500px] h-[700px] hidden md:block rounded-xl shadow-md"
            />
            <div className="flex flex-col md:text-left gap-8">
              <span className="font-extrabold text-4xl md:text-5xl">
                Instant Messaging
              </span>
              <div className="flex flex-col gap-12 text-xl md:text-2xl max-w-[400px]">
                <span>
                  Engage in real-time conversations with friends, teammates, and
                  fellow football enthusiasts. Our instant messaging feature
                  ensures you never miss a beat, allowing you to chat seamlessly
                  and stay updated on all the latest discussions.
                </span>
              </div>
            </div>
            <img
              src={chatimg}
              className="w-[300px] h-[500px] sm:w-[400px] sm:h-[700px] md:hidden rounded-xl shadow-md"
            />
          </div>
        </div>
      </section>
      <section className=" mx-auto text-green-500 text-center p-12 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col justify-center md:grid grid-cols-2 place-items-center my-12 gap-0 md:gap-0">
            <div className="flex flex-col items-center text-center md:text-left gap-8">
              <span className="font-extrabold text-4xl md:text-5xl">
                Keep up with your Team
              </span>
              <div className="flex flex-col gap-12 text-xl md:text-2xl max-w-[400px]">
                <span>
                  Never miss a moment with real-time updates on your team's
                  activities. From match scores and player stats to league
                  standings and important fixtures, stay informed and up-to-date
                  effortlessly.
                </span>
              </div>
            </div>
            <img
              src={fixtureimg}
              className="w-[300px] h-[500px] sm:w-[400px] sm:h-[700px] md:block rounded-xl shadow-md mt-12 md:mt-0"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
