import { FormEvent, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAxios from "../hooks/useAxios"

import data from "../leaguedata.json"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"
import { useModal } from "../contexts/ModalContext"

import AvatarModal from "../modals/AvatarModal"
import default_user_img from "../assets/default-user.png"
import Loading from "../components/common/Loading"

export default function Login() {
  const { loading, error, axiosFetch } = useAxios()
  const navigate = useNavigate()
  const { currentUser, login } = useAuth()
  const { showModal, hideModal } = useModal()

  const [formType, setFormType] = useState<string>("login")

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [selectedLeague, setSelectedLeague] = useState("")
  const [leagueId, setLeagueId] = useState<number | null>(null)
  const [team, setTeam] = useState<number | null>(null)
  const [selectedTeamName, setSelectedTeamName] = useState("")

  const [avatar, setAvatar] = useState("")
  const [croppedAvatar, setCroppedAvatar] = useState<any>(null)

  let league = data.leagues.find((league) => league.name === selectedLeague)

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard")
    }
  }, [currentUser])

  useEffect(() => {
    setUsername("")
    setPassword("")
  }, [formType])

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await login(username, password)
  }

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    axiosFetch({
      method: "post",
      url: "/api/auth/signup",
      requestConfig: {
        data: {
          email: email,
          username: username,
          password: password,
          team: {
            id: team,
            name: selectedTeamName,
            logo: `https://media.api-sports.io/football/teams/${team}.png`,
            league: leagueId,
          },
          avatar: croppedAvatar,
        },
      },
      onSuccess() {
        setFormType("login")
      },
    })
  }

  if (error) {
    console.log(error)
  }

  function handleSelect(leagueName: string) {
    setSelectedLeague(leagueName)
    league = data.leagues.find((league) => league.name === selectedLeague)
    console.log(league)
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
    <div className="max-w-[500px] mx-auto flex items-center justify-center min-h-screen p-12 py-16">
      {formType === "login" && (
        <form
          className="flex flex-col p-4 gap-4 border-2 bg-gray-50 rounded-md shadow-md w-full"
          onSubmit={handleLogin}
        >
          <span className="text-3xl text-center">Log in</span>
          <div className="flex flex-col gap-1 text-lg">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              placeholder="Username"
              className="rounded-lg p-1"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 text-lg">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Password"
              className="rounded-lg p-1"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="flex justify-center my-4 bg-white rounded-md p-2 mx-auto text-xl border">
            {loading ? <Loading /> : <span>Log in</span>}
          </button>
          <span
            className="hover:font-bold text-center cursor-pointer"
            onClick={() => setFormType("create-account")}
          >
            Not got an account?
          </span>
          <span className="hover:font-bold text-center cursor-pointer">
            Forgot password?
          </span>
        </form>
      )}
      {formType === "create-account" && (
        <form
          className="flex flex-col p-4 gap-4 border-2 bg-gray-50 rounded-md shadow-md w-full"
          onSubmit={handleSignup}
        >
          <span className="text-3xl text-center">Create Account</span>
          <div className="flex flex-col gap-1 text-lg">
            <label htmlFor="avatar">Avatar</label>
            <input
              className="rounded-lg p-1"
              id="avatar"
              type="file"
              accept="image/*, video/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          </div>
          <div
            onClick={handleImageClick}
            className=" flex justify-center cursor-pointer"
          >
            {croppedAvatar ? (
              <img
                id="preview-image"
                className="w-32 h-32"
                src={croppedAvatar}
              />
            ) : (
              <img
                id="preview-image"
                src={default_user_img}
                className="w-32 h-32"
              />
            )}
          </div>
          <div className="flex flex-col gap-1 text-lg">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="Email"
              className="rounded-lg p-1"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 text-lg">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              placeholder="Username"
              className="rounded-lg p-1"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-lg">
            <label htmlFor="team">Favourite Team</label>
            <div className="border-2 p-1 rounded-xl bg-white max-h-48 overflow-auto">
              {!team ? (
                <>
                  {!selectedLeague ? (
                    <>
                      {data.leagues.map((league, index) => (
                        <div
                          className="relative flex justify-between items-center cursor-pointer p-1"
                          key={index}
                          onClick={() => {
                            handleSelect(league.name), setLeagueId(league.id)
                          }}
                        >
                          <div className="flex gap-2">
                            <img
                              src={league.logo}
                              width={24}
                              alt="League Logo"
                            />
                            <span>{league.name}</span>
                          </div>
                          <FaChevronRight className="mx-4" />
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 items-center">
                        <FaChevronLeft
                          className="cursor-pointer"
                          onClick={() => setSelectedLeague("")}
                        />

                        <span>{selectedLeague}</span>
                      </div>
                      {league?.teams.map((team) => (
                        <div
                          className="flex items-center gap-2 p-1 cursor-pointer"
                          onClick={() => {
                            setTeam(team.id), setSelectedTeamName(team.name)
                          }}
                        >
                          <img
                            src={`https://media.api-sports.io/football/teams/${team.id}.png`}
                            width={24}
                            alt="Team Logo"
                          />
                          <span>{team.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-between p-2">
                  <span>{selectedTeamName}</span>
                  <span
                    className="cursor-pointer"
                    onClick={() => setTeam(null)}
                  >
                    Change Team
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-lg">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Password"
              className="rounded-lg p-1"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 text-lg">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              placeholder="Password"
              className="rounded-lg p-1"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="flex justify-center my-4 bg-white rounded-md p-2 border mx-auto text-xl">
            {loading ? <Loading /> : <span>Create Account</span>}
          </button>
          <span
            className="hover:font-bold text-center cursor-pointer"
            onClick={() => setFormType("login")}
          >
            Already have an account?
          </span>
        </form>
      )}
    </div>
  )
}
