import { Request, Response } from "express"
import axios from "axios"
import { Player } from "../models/playerModel"

import client from "../loaders/redis"
import { Team } from "../models/teamModel"
import { Post } from "../models/postModel"

export const dataController = {
  getFixture: async (req: Request, res: Response) => {
    let { id } = req.params

    try {
      const fixture = await client.get(`fixture-${id}`)

      return res.status(200).send(fixture)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getTrending: async (req: Request, res: Response) => {
    try {
      const trending = await client.zRangeWithScores("trending_words", 0, 9, {
        REV: true,
      })

      return res.status(200).send(trending)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  getHeadToHead: async (req: Request, res: Response) => {
    let { h2h } = req.params

    try {
      let config = {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": "2b04dc0863c0897b2360fb19617d642f",
        },
      }
      const response = await axios.get(
        `https://v3.football.api-sports.io/fixtures/headtohead?h2h=${h2h}&last=5`,
        config
      )

      const data = response.data.response

      return res.status(200).send(data)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  getFixtureEvents: async (req: Request, res: Response) => {
    let { id } = req.params

    try {
      let config = {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": "2b04dc0863c0897b2360fb19617d642f",
        },
      }
      const response = await axios.get(
        `https://v3.football.api-sports.io/fixtures/events?fixture=${id}`,
        config
      )

      const events = response.data.response

      return res.status(200).send(events)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getTodaysFixtures: async (req: Request, res: Response) => {
    try {
      const todaysFixtures = await client.get("todays-fixtures")

      return res.status(200).send(todaysFixtures)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getStandings: async (req: Request, res: Response) => {
    let { id } = req.params

    try {
      const standings = await client.get(`standings-league-${id}`)

      return res.status(200).send(standings)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  getSearchResults: async (req: Request, res: Response) => {
    let { type, query } = req.params

    try {
      if (type === "players") {
        const results = await Player.find({
          name: { $regex: new RegExp(query, "i") },
        })

        return res.status(200).send({ results: results, type: "players" })
      } else if (type === "teams") {
        const results = await Team.find({
          name: { $regex: new RegExp(query, "i") },
        })

        return res.status(200).send({ results: results, type: "teams" })
      } else if (type === "posts") {
        const results = await Post.find({
          content: { $regex: new RegExp(query, "i") },
        }).populate("user")

        return res.status(200).send({ results: results, type: "posts" })
      } else {
        return res.status(200).send("no results found")
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  checkTodaysFixtures: async (req: Request, res: Response) => {
    let { id } = req.params

    try {
      const todaysFixturesString = await client.get(`todays-fixtures`)

      if (todaysFixturesString === null) {
        return res.status(404).send("No fixtures for today.")
      }

      const fixtureIdToCheck = parseInt(id)

      const todaysFixtures = JSON.parse(todaysFixturesString)

      const isFixturePresent = todaysFixtures.some(
        (fixture: any) => fixture.id === fixtureIdToCheck
      )

      if (isFixturePresent) {
        return res.status(200).send(true)
      } else {
        return res.status(200).send(false)
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },

  getPlayer: async (req: Request, res: Response) => {
    let { id } = req.params

    try {
      // let config = {
      //   headers: {
      //     "x-rapidapi-host": "v3.football.api-sports.io",
      //     "x-rapidapi-key": "2b04dc0863c0897b2360fb19617d642f",
      //   },
      // }
      // const response = await axios.get(
      //   `https://v3.football.api-sports.io/players?id=${id}&season=2023`,
      //   config
      // )

      // let player = response.data.response[0]

      // const res2 = await axios.get(
      //   `https://v3.football.api-sports.io/players?league=${39}&season=2023`,
      //   config
      // )

      // const res3 = await axios.get(
      //   `https://v3.football.api-sports.io/trophies?player=${id}`,
      //   config
      // )

      // const res4 = await axios.get(
      //   `https://v3.football.api-sports.io/transfers?player=${id}`,
      //   config
      // )

      // const trophies = res3.data.response

      // const transfers = res4.data.response[0]

      // player = { ...player, trophies, transfers }
      const player = await client.get(`player-${id}`)

      return res.status(200).send(player)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getTeam: async (req: Request, res: Response) => {
    let { id } = req.params

    try {
      let infoData = await client.get(`team-${id}-info`)
      let info = infoData ? JSON.parse(infoData) : {}

      return res.status(200).send(info)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getFixtures40: async (req: Request, res: Response) => {
    try {
      const response = await client.get("fixtures-40")

      return res.status(200).send(response)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getTeamL: async (req: Request, res: Response) => {
    try {
      const response = await client.get("team-40-L")

      return res.status(200).send(response)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getTeamStats: async (req: Request, res: Response) => {
    try {
      let { id } = req.params
      let { season } = req.query
      console.log(id, season)

      const response = await client.get(`team-${id}-stats-${season}`)
      console.log(response)

      return res.status(200).send(response)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getTeamSquad: async (req: Request, res: Response) => {
    let { id } = req.params

    try {
      const response = await client.get(`squad-${id}`)

      return res.status(200).send(response)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getTeamFixtures: async (req: Request, res: Response) => {
    let { id } = req.params

    try {
      const response = await client.get(`fixtures-${id}`)

      return res.status(200).send(response)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getTeamStandings: async (req: Request, res: Response) => {
    let { id } = req.params

    try {
      const response = await client.get(`standings-${id}`)

      return res.status(200).send(response)
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
  getTeamTransfers: async (req: Request, res: Response) => {
    let { id } = req.params

    try {
      const response = await client.get(`transfers-${id}`)

      return res.status(200).send(response)
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        return res.status(500).send(error.message)
      }
      return res.status(500).send({ error: "Unknown server error occurred" })
    }
  },
}
