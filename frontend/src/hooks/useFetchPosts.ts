import { useState, useEffect, useRef } from "react"
import { Post } from "../types"
import useAxios from "./useAxios"

export default function useFetchPosts(currentPage: number, postsType: string) {
  const { axiosFetch } = useAxios()
  const [posts, setPosts] = useState<Post[]>([])
  const prevPostsType = useRef(postsType)

  useEffect(() => {
    const fetchPosts = async () => {
      axiosFetch({
        method: "get",
        url: `/api/posts?page=${currentPage}&limit=10&type=${postsType}`,
        onSuccess(data: Post[]) {
          if (prevPostsType.current !== postsType) {
            setPosts(data)
            prevPostsType.current = postsType
          } else {
            setPosts((prevPosts) => {
              const existingPostIds = new Set(prevPosts.map((post) => post._id))
              const newPosts = data.filter(
                (post) => !existingPostIds.has(post._id)
              )
              return [...prevPosts, ...newPosts]
            })
          }
        },
      })
    }

    fetchPosts()
  }, [currentPage, postsType])

  return { posts, setPosts }
}
