import { useState, useEffect } from "react"

import api from "../api/api"

type Methods = "get" | "post" | "put" | "delete"

interface ConfigObj {
  method: Methods
  url: string
  requestConfig?: any
  onSuccess?: (data: any) => void
  onError?: (data: string) => void
}

interface AxiosResult {
  data: any
  error: string | null
  loading: boolean
  axiosFetch: (configObj: ConfigObj) => void
}

const useAxios = (): AxiosResult => {
  const [data, setData] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false) //different!
  const [controller, setController] = useState<AbortController | undefined>(
    undefined
  )

  const axiosFetch = async (configObj: ConfigObj) => {
    const { method, url, requestConfig = {}, onSuccess, onError } = configObj

    try {
      setLoading(true)
      const ctrl = new AbortController()
      setController(ctrl)
      const res = await api[method](url, {
        ...requestConfig,
        signal: ctrl.signal,
      })
      setData(res.data)
      if (onSuccess) {
        onSuccess(res.data)
      }
    } catch (err: any) {
      setError(err.response.data.error)

      if (onError) {
        onError(error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    return () => controller && controller.abort()
  }, [controller])

  return { data, error, loading, axiosFetch }
}

export default useAxios
