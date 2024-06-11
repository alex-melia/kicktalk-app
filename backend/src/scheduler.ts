import { scheduleJob } from "node-schedule"
import { useAPI } from "./utils/useAPI"
import client from "./redis"
import { Player } from "./models/playerModel"
import natural from "natural"
import { Post } from "./models/postModel"
import stopword from "stopword"
import { removeStopwords } from "stopword"

// const LEAGUE_IDS = [39]
const LEAGUE_IDS = [39, 40, 140]
const TEAM_IDS = [
  33, 34, 35, 36, 39, 40, 42, 44, 45, 47, 48, 49, 50, 51, 52, 55, 62, 65, 66,
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
    // console.log(data)

    if (data && data.response && Array.isArray(data.response)) {
      data.response.forEach((item: any) => {
        console.log(item)

        // cacheData(key, item)
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
  console.log("entered")
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

const checkNext5Fixtures = async () => {
  for (const team_id of TEAM_IDS) {
    let data = await useAPI("get", `/fixtures?team=${team_id}&next=5`)
    if (data.results) {
      cacheData(`next5Fixtures-${team_id}`, data.response)
    }
  }

  console.log("done")
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
  console.log("done")
}

const checkTeamLeagues = async () => {
  const availableSeasonsString = await client.get(`seasons-40`)

  // Remove square brackets and trim whitespace
  const availableSeasons = availableSeasonsString
    ?.replace(/[\[\]]/g, "")
    .trim()
    .split(",")

  console.log(availableSeasons)

  availableSeasons?.forEach(async (season: any) => {
    console.log(season)
    let data = await useAPI("get", `/leagues?team=40&season=${season}`)
    if (data.results) {
      cacheData(`leagues-40-season-${season}`, data.response)
    }
  })
}

const checkTeamFixtures = async () => {
  const availableSeasonsString = await client.get(`seasons-40`)

  // Remove square brackets and trim whitespace
  const availableSeasons = availableSeasonsString
    ?.replace(/[\[\]]/g, "")
    .trim()
    .split(",")

  let fixturesArr: any[] = []

  availableSeasons?.forEach(async (season: any) => {
    let data = await useAPI("get", `/fixtures?team=40&season=${season}`)
    // console.log(data)

    if (data.results) {
      console.log(data.response)
    }
  })

  console.log(fixturesArr)
}

const checkTeamStats = async () => {
  const availableSeasonsString = await client.get(`seasons-40`)

  // Remove square brackets and trim whitespace
  const availableSeasons: any = availableSeasonsString
    ?.replace(/[\[\]]/g, "")
    .trim()
    .split(",")

  for (const season of availableSeasons) {
    let leagues = await client.get(`leagues-40-season-${season}`)

    let leagueData = leagues ? JSON.parse(leagues) : {}

    const statsArr: any[] = []

    for (const entry of leagueData) {
      let data = await useAPI(
        "get",
        `/teams/statistics?team=40&season=${season}&league=${entry.league.id}`
      )

      if (data.results) {
        console.log(data.response)

        statsArr.push(data.response)
      }
    }

    cacheData(`team-40-stats-${season}`, statsArr)
  }
}
// for (const team_id of TEAM_IDS) {
//   let data = await useAPI("get", `/teams/statistics?team=${team_id}`)

//   if (data.results) {
//     console.log(data.response)

//     cacheData(`team-${team_id}-info`, data.response[0])
//   }
// }

const checkTeamInfo = async () => {
  for (const team_id of TEAM_IDS) {
    let data = await useAPI("get", `/teams?id=${team_id}`)

    if (data.results) {
      console.log(data.response)

      cacheData(`team-${team_id}-info`, data.response[0])
    }
  }
}

const checkTeamL = async () => {
  let data = await useAPI("get", `/leagues?team=40`)

  if (data.results) {
    cacheData(`team-40-L`, data.response[0])
  }
}

const checkTeamSquads = async () => {
  let data = await useAPI("get", `/players/squads?team=40`)

  if (data.results) {
    cacheData(`squad-40`, data.response[0].players)
  }
}

const checkTeamFixturess = async () => {
  for (const team_id of TEAM_IDS) {
    let data = await useAPI("get", `/fixtures/?team=${team_id}&season=2023`)

    if (data.results) {
      cacheData(`fixtures-${team_id}`, data.response)
    }
  }
}

const checkTeamStandings = async () => {
  let data = await useAPI("get", `/standings/?team=40&season=2023`)

  if (data.results) {
    console.log(data.response)

    cacheData(`standings-40`, data.response)
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

    console.log(filteredData)

    // let i = 0
    // data.response.map((transfer: any) => {

    //     console.log(transfer.transfers.date)

    // })

    // console.log(data.response)

    cacheData(`transfers-40`, filteredData)
  }
}

export const dailyJobs = async () => {
  // scheduleJob("02 14 * * *", async () => {
  //   await checkTodaysFixtures()
  // })
  // scheduleJob("36 13 * * *", async () => {
  //   await getPlayersData()
  // })
  // scheduleJob("04 16 * * *", async () => {
  //   await checkNext5Fixtures()
  // })
  // scheduleJob("47 15 * * *", async () => {
  //   await getStandingsFromAPI()
  // })
  // scheduleJob("50 10 * * *", async () => {
  //   await checkLeagueFixtures()
  // })
  scheduleJob("42 15 * * *", async () => {
    await checkTrending()
  })
  // scheduleJob("54 16 * * *", async () => {
  //   await checkTeamInfo()
  // })
  // scheduleJob("09 17 * * *", async () => {
  //   await checkTeamLeagues()
  // })
  // scheduleJob("44 16 * * *", async () => {
  //   await checkTeamStats()
  // })
  // scheduleJob("17 16 * * *", async () => {
  //   await checkTeamL()
  // })
  // scheduleJob("41 20 * * *", async () => {
  //   await checkTeamSquads()
  // })
  // scheduleJob("05 15 * * *", async () => {
  //   await checkTeamFixturess()
  // })
  // scheduleJob("46 18 * * *", async () => {
  //   await checkTeamStandings()
  // })
  // scheduleJob("30 02 * * *", async () => {
  //   await checkTeamTransfers()
  // })
  // scheduleJob("00 18 * * *", async () => {
  //   await checkTeamSeasons()
  // })
  // scheduleJob("55 19 * * *", async () => {
  //   await checkTeamLeagues()
  // })
  // scheduleJob("09 20 * * *", async () => {
  //   await checkTeamFixtures()
  // })
  // scheduleJob("00 23 * * *", async () => {
  //   await getStandingsFromAPI()
  // })
}
