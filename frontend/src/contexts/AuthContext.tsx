import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import useAxios from "../hooks/useAxios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { CurrentUser } from "../types"

interface AuthProviderProps {
  children: ReactNode
}

interface AuthContext {
  currentUser: CurrentUser | null
  signup: (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    username: string,
    bio: string,
    addresses: Object[],
    wishlist: Object[]
  ) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
}

const AuthContext = createContext({} as AuthContext)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { axiosFetch: signUp } = useAxios()
  const { axiosFetch: logIn } = useAxios()
  const { axiosFetch: logOut } = useAxios()
  const { axiosFetch: getCurrentUser } = useAxios()

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  const navigate = useNavigate()

  const signup = async (email: string, username: string, password: string) => {
    signUp({
      method: "post",
      url: "/api/auth/signup",
      requestConfig: {
        data: {
          email,
          username,
          password,
        },
      },
    })
    await fetchCurrentUser()
  }

  const login = async (username: string, password: string) => {
    await logIn({
      method: "post",
      url: "/api/auth/login",
      requestConfig: {
        data: {
          username,
          password,
        },
      },
      onSuccess: () => {
        fetchCurrentUser()
      },
      onError: (data) => {
        console.log(data)
        toast.error(data)
      },
    })
  }

  const logout = async () => {
    await logOut({
      method: "post",
      url: "/api/auth/logout",
      onSuccess: () => {
        fetchCurrentUser()
        navigate("/")
      },
    })
  }

  async function fetchCurrentUser() {
    await getCurrentUser({
      method: "get",
      url: "/api/auth/currentuser",
      onSuccess: (data) => setCurrentUser(data.currentUser),
    })
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
