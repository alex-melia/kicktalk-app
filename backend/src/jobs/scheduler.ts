import { scheduleJob } from "node-schedule"
import { useAPI } from "../utils/useAPI"
import client from "../loaders/redis"
import { Player } from "../models/playerModel"
import natural from "natural"
import { Post } from "../models/postModel"
import { removeStopwords } from "stopword"
import { Team } from "../models/teamModel"

const LEAGUE_IDS = [39]
const TEAM_IDS = [
  33, 34, 35, 36, 39, 40, 42, 44, 45, 47, 48, 49, 50, 51, 52, 55, 62, 65, 66,
  1359,
]

const cacheData = async (key: string, data: any) => {
  await client.set(key, JSON.stringify(data))
}

const createJob = async (fixtureId: number, date: string, type: string) => {
  let startDate = new Date(date)
  let now = Date.now()

  if (type === "fixture") {
    const job = scheduleJob({ start: now, rule: "*/1 * * * *" }, async () => {
      console.log(`Fixture job ${fixtureId} started.`)

      const fixture = await useAPI("get", `/fixtures?id=${fixtureId}`)
      cacheData(`fixture-${fixtureId}`, fixture.response[0])

      const events = await useAPI(
        "get",
        `/fixtures/events?fixture=${fixtureId}`
      )

      if (fixture && fixture.response && fixture.response[0]) {
        const fixtureStatus = fixture.response[0].fixture.status.short

        fixture.response[0].events = events.response
        cacheData(`fixture-${fixtureId}`, fixture.response[0])

        if (fixtureStatus === "FT") {
          console.log(`Fixture ${fixtureId} finished. Canceling job.`)
          job.cancel()
        }
      }
    })
  }
}

const getStandingsFromAPI = async () => {
  for (const id of LEAGUE_IDS) {
    let key = `standings-league-${id}`
    let data = await useAPI("get", `/standings?league=${id}&season=2023`)

    if (data && data.response && Array.isArray(data.response)) {
      data.response.forEach((item: any) => {
        console.log(item)

        cacheData(key, item)
      })
    }
  }
}

const checkTodaysFixtures = async () => {
  const today = new Date().toISOString().split("T")[0]

  console.log(today)

  let fix: any = []

  for (const id of LEAGUE_IDS) {
    let data = await useAPI(
      "get",
      `/fixtures?league=${id}&season=2023&from=${today}&to=${today}`
    )

    if (data.results) {
      console.log(data.response)
      fix.push(data.response)
      data.response.forEach((fixture: any) => {
        createJob(fixture.fixture.id, `${fixture.fixture.date}`, "fixture")
        cacheData(`fixture-${fixture.fixture.id}`, fixture)
      })
    }
    cacheData(`todays-fixtures`, fix)
  }
}

const checkLeagueFixtures = async () => {
  for (const id of LEAGUE_IDS) {
    let data = await useAPI("get", `/fixtures?league=${id}&season=2023`)

    if (data.results) {
      for (const fixture of data.response) {
        let fixtureData = await useAPI(
          "get",
          `/fixtures?id=${fixture.fixture.id}`
        )

        console.log("id: ", fixture.fixture.id)
        console.log(fixtureData)

        await cacheData(
          `fixture-${fixture.fixture.id}`,
          fixtureData.response[0]
        )
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
    }
  }
}

const getPlayersData = async () => {
  for (const team_id of TEAM_IDS) {
    // Initial call to get the total number of pages
    let initialData = await useAPI(
      "get",
      `/players?team=${team_id}&season=2023&page=1`
    )
    const totalPages = initialData.paging.total

    // Loop through each page
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      let data
      if (currentPage > 1) {
        // Fetch data for current page if not the initial page
        data = await useAPI(
          "get",
          `/players?team=${team_id}&season=2023&page=${currentPage}`
        )
      } else {
        // Use initial data for the first page
        data = initialData
      }

      // Process each player on the current page
      for (let playerData of data.response) {
        const currentPlayer = playerData.player

        const player = await Player.create({
          id: currentPlayer.id,
          name: currentPlayer.name,
          firstname: currentPlayer.firstname,
          lastname: currentPlayer.lastname,
          image: currentPlayer.photo, // Assuming 'photo' is correct and exists in your data model
          age: currentPlayer.age,
          nationality: currentPlayer.nationality,
        })
        // Consider handling the promise (await) results here, like logging or further processing
      }
    }
  }
}

const getTeamsData = async () => {
  // Initial call to get the total number of pages
  let data = await useAPI("get", `/teams?league=39&season=2023`)

  // Process each player on the current page
  for (let teamData of data.response) {
    const currentTeam = teamData.team

    const team = await Team.create({
      id: currentTeam.id,
      name: currentTeam.name,
      country: currentTeam.country,
      logo: currentTeam.logo,
    })
  }
}

const checkTrending = async () => {
  const tokenizer = new natural.WordTokenizer()

  try {
    await client.del("trending_words")
    // Fetch recent posts within the last hour
    const oneHourAgo = new Date(Date.now() - 3600000)
    const recentPosts = await Post.find({
      createdAt: { $gte: oneHourAgo },
    })

    // Process each post
    recentPosts.forEach(async (post) => {
      const content = <any>post.content
      const tokens = tokenizer.tokenize(content)
      const filteredTokens = removeStopwords(tokens)

      // Increment word counts in Redis
      filteredTokens.forEach(async (word: any) => {
        const cleanWord =
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        await client.zIncrBy("trending_words", 1, cleanWord)
      })
    })

    await client.zRangeWithScores("trending_words", 0, 4, {
      REV: true,
    })
  } catch (error) {
    console.error("Error processing trending words:", error)
  }
}

const checkTeamSeasons = async () => {
  for (const team_id of TEAM_IDS) {
    let data = await useAPI("get", `/teams/seasons?team=${team_id}`)
    if (data.results) {
      cacheData(`seasons-${team_id}`, data.response)
    }
  }
}

const checkTeamLeagues = async () => {
  for (const team_id of TEAM_IDS) {
    const availableSeasonsString = await client.get(`seasons-${team_id}`)

    // Remove square brackets and trim whitespace
    const availableSeasons = availableSeasonsString
      ?.replace(/[\[\]]/g, "")
      .trim()
      .split(",")

    console.log(availableSeasons)

    availableSeasons?.forEach(async (season: any) => {
      for (const team_id of TEAM_IDS) {
        let data = await useAPI(
          "get",
          `/leagues?team=${team_id}&season=${season}`
        )
        if (data.results) {
          cacheData(`leagues-${team_id}-season-${season}`, data.response)
        }
      }
    })
  }
}

const checkTeamStats = async () => {
  for (const team_id of TEAM_IDS) {
    const availableSeasonsString = await client.get(`seasons-${team_id}`)

    // Remove square brackets and trim whitespace
    const availableSeasons: any = availableSeasonsString
      ?.replace(/[\[\]]/g, "")
      .trim()
      .split(",")

    for (const season of availableSeasons) {
      let leagues = await client.get(`leagues-${team_id}-season-${season}`)

      let leagueData = leagues ? JSON.parse(leagues) : {}

      if (Object.keys(leagueData).length > 0) {
        const statsArr: any[] = []

        console.log(leagueData)
        for (const entry of leagueData) {
          let data = await useAPI(
            "get",
            `/teams/statistics?team=${team_id}&season=${season}&league=${entry.league.id}`
          )

          if (data.results) {
            console.log(data.response)

            statsArr.push(data.response)
          }
        }

        cacheData(`team-${team_id}-stats-${season}`, statsArr)
      }
    }
  }
}

const checkTeamInfo = async () => {
  for (const team_id of TEAM_IDS) {
    let data = await useAPI("get", `/teams?id=${team_id}`)

    if (data.results) {
      console.log(data.response)

      cacheData(`team-${team_id}-info`, data.response[0])
    }
  }
}

const checkTeamSquads = async () => {
  for (const team_id of TEAM_IDS) {
    let data = await useAPI("get", `/players/squads?team=${team_id}`)

    if (data.results) {
      cacheData(`squad-${team_id}`, data.response[0].players)
    }
  }
}

const checkTeamFixtures = async () => {
  for (const team_id of TEAM_IDS) {
    let data = await useAPI("get", `/fixtures/?team=${team_id}&season=2023`)

    if (data.results) {
      cacheData(`fixtures-${team_id}`, data.response)
    }
  }
}

const checkTeamStandings = async () => {
  for (const team_id of TEAM_IDS) {
    let data = await useAPI("get", `/standings/?team=${team_id}&season=2023`)

    if (data.results) {
      console.log(data.response)

      cacheData(`standings-${team_id}`, data.response)
    }
  }
}

const checkTeamTransfers = async () => {
  let data = await useAPI("get", `/transfers/?team=40`)

  if (data.results) {
    console.log(data.response)

    const filteredData = data.response.filter((item: any) => {
      // Define the cut-off date of July 1st, 2023
      const cutOffDate = new Date("2023-07-01")

      // Check if any transfer within the 'transfers' array is after July 1st, 2023
      return item.transfers.some((transfer: any) => {
        const transferDate = new Date(transfer.date)
        return transferDate > cutOffDate
      })
    })

    cacheData(`transfers-40`, filteredData)
  }
}

// let res1 = await useAPI("get", `/players/?id=306&season=2023`)
// let res2 = await useAPI("get", `/trophies/?player=306`)
// let res3 = await useAPI("get", `/transfers/?player=306`)

// let playerData = res1.response[0]
// let playerTrophies = res2.response
// let playerTransfers = res3.response[0]

// let player = { ...playerData, playerTrophies, playerTransfers }
// const getP = async () => {
//   for (const team_id of TEAM_IDS) {
//     let squad = await client.get(`squad-${team_id}`)

//     let squadArray = squad && JSON.parse(squad)

//     if (squadArray) {
//       for (const player of squadArray) {
//         try {
//           let res1 = await useAPI(
//             "get",
//             `/players/?id=${player.id}&season=2023`
//           )
//           let res2 = await useAPI("get", `/trophies/?player=${player.id}`)
//           let res3 = await useAPI("get", `/transfers/?player=${player.id}`)
//           // let [res1, res2, res3] = await Promise.all([
//           //   useAPI("get", `/players/?id=${player.id}&season=2023`),
//           //   useAPI("get", `/trophies/?player=${player.id}`),
//           //   useAPI("get", `/transfers/?player=${player.id}`),
//           // ])

//           let playerData = res1.response[0]
//           let trophies = res2.response
//           let transfers = res3.response[0]

//           let playerObj = { ...playerData, trophies, transfers }

//           console.log(player.id, playerObj)

//           await cacheData(`player-${player.id}`, playerObj)
//         } catch (error) {
//           console.error(`Failed to fetch data for player ${player.id}:`, error)
//         }
//       }
//     }

//     // squadArray?.map(async (player: any) => {
//     //   let res1 = await useAPI("get", `/players/?id=${player.id}&season=2023`)
//     //   let res2 = await useAPI("get", `/trophies/?player=${player.id}`)
//     //   let res3 = await useAPI("get", `/transfers/?player=${player.id}`)

//     //   let playerData = res1.response[0]
//     //   let trophies = res2.response
//     //   let transfers = res3.response[0]

//     //   console.log(playerData)
//     //   let playerObj = { ...playerData, trophies, transfers }

//     //   await cacheData(`player-${player.id}`, playerObj)
//     // })
//   }
// }

const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchWithRetry = async (url: any, retries = 4) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await useAPI("get", url)
      return response
    } catch (error) {
      if (attempt === retries - 1) {
        console.error(
          `Failed to fetch ${url} after ${retries} attempts:`,
          error
        )
        throw error
      }
      await delay(3000) // Wait 1 second before retrying
    }
  }
}

const processPlayer = async (player: any) => {
  try {
    let [res1, res2, res3] = await Promise.all([
      fetchWithRetry(`/players/?id=${player.id}&season=2023`),
      fetchWithRetry(`/trophies/?player=${player.id}`),
      fetchWithRetry(`/transfers/?player=${player.id}`),
    ])

    let playerData = res1.response[0]
    let trophies = res2.response
    let transfers = res3.response[0]

    let playerObj = { ...playerData, trophies, transfers }
    console.log(playerObj)

    await cacheData(`player-${player.id}`, playerObj)
  } catch (error) {
    console.error(`Failed to fetch data for player ${player.id}:`, error)
  }
}

const getP = async () => {
  for (const team_id of TEAM_IDS) {
    try {
      let squad = await client.get(`squad-${team_id}`)
      let squadArray = squad && JSON.parse(squad)

      if (squadArray) {
        for (const player of squadArray) {
          await processPlayer(player)
          await delay(200) // Wait 200 milliseconds before processing the next player
        }
      }
    } catch (error) {
      console.error(`Failed to fetch squad for team ${team_id}:`, error)
    }
  }
}

export const dailyJobs = async () => {
  // scheduleJob("42 19 * * *", async () => {
  //   await checkTodaysFixtures()
  // })
  // scheduleJob("18 00 * * *", async () => {
  //   await getPlayersData()
  // })
  // scheduleJob("17 00 * * *", async () => {
  //   await getTeamsData()
  // })
  // scheduleJob("37 19 * * *", async () => {
  //   await checkLeagueFixtures()
  // })
  scheduleJob("32 13 * * *", async () => {
    await checkTrending()
  })
  // scheduleJob("46 23 * * *", async () => {
  //   await checkTeamInfo()
  // })
  // scheduleJob("45 23 * * *", async () => {
  //   await checkTeamLeagues()
  // })
  // scheduleJob("46 23 * * *", async () => {
  //   await checkTeamStats()
  // })
  // scheduleJob("46 23 * * *", async () => {
  //   await checkTeamSquads()
  // })
  // scheduleJob("57 19 * * *", async () => {
  //   await checkTeamFixtures()
  // })
  // scheduleJob("59 19 * * *", async () => {
  //   await checkTeamStandings()
  // })
  // scheduleJob("30 02 * * *", async () => {
  //   await checkTeamTransfers()
  // })
  // scheduleJob("44 23 * * *", async () => {
  //   await checkTeamSeasons()
  // })
  // scheduleJob("09 20 * * *", async () => {
  //   await checkTeamFixtures()
  // })
  scheduleJob("57 14 * * *", async () => {
    await getStandingsFromAPI()
  })
  // scheduleJob("17 00 * * *", async () => {
  //   await getP()
  // })
}
