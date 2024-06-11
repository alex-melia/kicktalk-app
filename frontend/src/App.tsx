import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import io from "socket.io-client"

import { AuthProvider } from "./contexts/AuthContext"
import { ModalProvider } from "./contexts/ModalContext"

import AppLayout from "./layouts/AppLayout"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import User from "./pages/User"
import Fixture from "./pages/Fixture"
import Post from "./pages/Post"
import Search from "./pages/Search"
import Messages from "./pages/Messages"
import Player from "./pages/Player"
import Team from "./pages/Team"
import Settings from "./pages/Settings"
import Notifications from "./pages/Notifications"
import Fixtures from "./pages/Fixtures"
import Standings from "./pages/Standings"
import Explore from "./pages/Explore"
import Event from "./pages/Event"
import NotFound from "./pages/NotFound"

const SOCKET_IO_URL = import.meta.env.SOCKET_IO_URL

const socket = io(SOCKET_IO_URL, {
  transports: ["websocket"],
})

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Toaster position="top-center" />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />

              <Route path="/:username" element={<User />} />
              <Route path="/:username/replies" element={<User />} />
              <Route path="/:username/media" element={<User />} />
              <Route path="/:username/likes" element={<User />} />

              <Route path="/:username/status/:postId" element={<Post />} />
              <Route path="/fixtures/:id" element={<Fixtures />} />
              <Route path="/standings/:id" element={<Standings />} />
              <Route
                path="/fixture/:id"
                element={<Fixture socket={socket} />}
              />

              <Route path="/search" element={<Search />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/player/:id" element={<Player socket={socket} />} />
              <Route path="/event/:id" element={<Event />} />
              <Route path="/team/:id" element={<Team />} />
              <Route path="/messages" element={<Messages socket={socket} />} />
              <Route
                path="/messages/:id"
                element={<Messages socket={socket} />}
              />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings/*" element={<Settings />} />
              <Route path="/settings/:type" element={<Settings />} />
              <Route path="/settings/:option/:type" element={<Settings />} />
            </Route>
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
//
export default App
