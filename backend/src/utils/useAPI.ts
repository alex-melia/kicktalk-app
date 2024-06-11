import axios from "axios"

const config = {
  headers: {
    "x-rapidapi-host": "v3.football.api-sports.io",
    "x-rapidapi-key": "2b04dc0863c0897b2360fb19617d642f",
  },
}

export const useAPI = async (
  method: string,
  url: string,
  data = null,
  retryCount = 3
) => {
  let attempts = 0

  while (attempts < retryCount) {
    try {
      let response
      const fullUrl = `https://v3.football.api-sports.io${url}`

      switch (method.toLowerCase()) {
        case "get":
          response = await axios.get(fullUrl, config)
          break
        case "post":
          response = await axios.post(fullUrl, data, config)
          break
        case "put":
          response = await axios.put(fullUrl, data, config)
          break
        case "delete":
          response = await axios.delete(fullUrl, config)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }

      return response.data
    } catch (error: any) {
      attempts++
      console.error("Error fetching data: ", error.message)

      if (attempts >= retryCount) {
        console.error("Max retries reached. Failing...")
        throw error
      }

      // Implement a backoff strategy or delay if desired
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts))
    }
  }
}
