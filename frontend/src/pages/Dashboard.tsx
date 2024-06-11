import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaPlus } from "react-icons/fa"

import { useAuth } from "../contexts/AuthContext"
import { useModal } from "../contexts/ModalContext"
import useFetchPosts from "../hooks/useFetchPosts"
import PostModal from "../modals/PostModal"

import PostForm from "../components/posts/PostForm"
import PostList from "../components/posts/PostList"
import SideComponents from "../components/common/SideComponents"
import Loading from "../components/common/Loading"
import { Post } from "../types"

export default function Dashboard() {
  const { currentUser, fetchCurrentUser } = useAuth()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [postsType, setPostsType] = useState<string>("all")
  const { posts, setPosts } = useFetchPosts(currentPage, postsType)
  const { showModal } = useModal()
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  const lastPostElementRef = useRef(null)

  const handleTypeChange = (newType: string) => {
    if (newType !== postsType) {
      setPostsType(newType)
      setCurrentPage(1)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        navigate("/login")
      })
  }, [])

  useEffect(() => {
    const currentElement = lastPostElementRef.current
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting) {
        setCurrentPage((prevPageNumber) => prevPageNumber + 1)
      }
    })

    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.disconnect()
      }
    }
  }, [lastPostElementRef.current])

  if (loading) {
    return <Loading />
  }

  if (!currentUser) {
    navigate("/")
    return null
  }

  const handleNewPost = (newPost: Post) => {
    setPosts((prevPosts: any) => [newPost, ...prevPosts])
  }

  return (
    <>
      <div className="w-full">
        <div className="md:flex w-full gap-4">
          <div className="lg:w-8/12 w-full sm:border-x-2 min-h-screen h-full">
            <div className="sticky top-16 sm:top-0 z-30 flex justify-between w-full font-bold text-xl border-b-2">
              <div
                onClick={() => handleTypeChange("all")}
                className="hover:bg-green-500 hover:text-white flex justify-center items-center w-full bg-white hover:cursor-pointer h-14"
              >
                <span>All</span>
              </div>
              <div
                onClick={() => handleTypeChange("following")}
                className="hover:bg-green-500 hover:text-white flex justify-center items-center w-full bg-white hover:cursor-pointer h-14"
              >
                <span>Following</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <PostForm onNewPost={handleNewPost} />
            </div>
            {posts && <PostList posts={posts} />}
            {posts && (
              <>
                <span className="mt-22" ref={lastPostElementRef}>
                  {" "}
                </span>
              </>
            )}
          </div>
          <SideComponents />
        </div>
      </div>
      <div
        onClick={() => showModal(<PostModal />)}
        className="sm:hidden fixed bottom-0 right-0 my-20 mr-2 bg-green-500 rounded-full z-50 p-2 text-white hover:cursor-pointer"
      >
        <FaPlus size={42} />
      </div>
    </>
  )
}
