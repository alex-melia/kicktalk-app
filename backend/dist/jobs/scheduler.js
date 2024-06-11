"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyJobs = void 0;
const node_schedule_1 = require("node-schedule");
const useAPI_1 = require("../utils/useAPI");
const redis_1 = __importDefault(require("../loaders/redis"));
const playerModel_1 = require("../models/playerModel");
const natural_1 = __importDefault(require("natural"));
const postModel_1 = require("../models/postModel");
const stopword_1 = require("stopword");
const teamModel_1 = require("../models/teamModel");
const LEAGUE_IDS = [39];
const TEAM_IDS = [
    33, 34, 35, 36, 39, 40, 42, 44, 45, 47, 48, 49, 50, 51, 52, 55, 62, 65, 66,
    1359,
];
const cacheData = (key, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.default.set(key, JSON.stringify(data));
});
const createJob = (fixtureId, date, type) => __awaiter(void 0, void 0, void 0, function* () {
    let startDate = new Date(date);
    let now = Date.now();
    if (type === "fixture") {
        const job = (0, node_schedule_1.scheduleJob)({ start: now, rule: "*/1 * * * *" }, () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Fixture job ${fixtureId} started.`);
            const fixture = yield (0, useAPI_1.useAPI)("get", `/fixtures?id=${fixtureId}`);
            cacheData(`fixture-${fixtureId}`, fixture.response[0]);
            const events = yield (0, useAPI_1.useAPI)("get", `/fixtures/events?fixture=${fixtureId}`);
            if (fixture && fixture.response && fixture.response[0]) {
                const fixtureStatus = fixture.response[0].fixture.status.short;
                fixture.response[0].events = events.response;
                cacheData(`fixture-${fixtureId}`, fixture.response[0]);
                if (fixtureStatus === "FT") {
                    console.log(`Fixture ${fixtureId} finished. Canceling job.`);
                    job.cancel();
                }
            }
        }));
    }
});
const getStandingsFromAPI = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const id of LEAGUE_IDS) {
        let key = `standings-league-${id}`;
        let data = yield (0, useAPI_1.useAPI)("get", `/standings?league=${id}&season=2023`);
        if (data && data.response && Array.isArray(data.response)) {
            data.response.forEach((item) => {
                console.log(item);
                cacheData(key, item);
            });
        }
    }
});
const checkTodaysFixtures = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date().toISOString().split("T")[0];
    console.log(today);
    let fix = [];
    for (const id of LEAGUE_IDS) {
        let data = yield (0, useAPI_1.useAPI)("get", `/fixtures?league=${id}&season=2023&from=${today}&to=${today}`);
        if (data.results) {
            console.log(data.response);
            fix.push(data.response);
            data.response.forEach((fixture) => {
                createJob(fixture.fixture.id, `${fixture.fixture.date}`, "fixture");
                cacheData(`fixture-${fixture.fixture.id}`, fixture);
            });
        }
        cacheData(`todays-fixtures`, fix);
    }
});
const checkLeagueFixtures = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const id of LEAGUE_IDS) {
        let data = yield (0, useAPI_1.useAPI)("get", `/fixtures?league=${id}&season=2023`);
        if (data.results) {
            for (const fixture of data.response) {
                let fixtureData = yield (0, useAPI_1.useAPI)("get", `/fixtures?id=${fixture.fixture.id}`);
                console.log("id: ", fixture.fixture.id);
                console.log(fixtureData);
                yield cacheData(`fixture-${fixture.fixture.id}`, fixtureData.response[0]);
                yield new Promise((resolve) => setTimeout(resolve, 250));
            }
        }
    }
});
const getPlayersData = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const team_id of TEAM_IDS) {
        // Initial call to get the total number of pages
        let initialData = yield (0, useAPI_1.useAPI)("get", `/players?team=${team_id}&season=2023&page=1`);
        const totalPages = initialData.paging.total;
        // Loop through each page
        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            let data;
            if (currentPage > 1) {
                // Fetch data for current page if not the initial page
                data = yield (0, useAPI_1.useAPI)("get", `/players?team=${team_id}&season=2023&page=${currentPage}`);
            }
            else {
                // Use initial data for the first page
                data = initialData;
            }
            // Process each player on the current page
            for (let playerData of data.response) {
                const currentPlayer = playerData.player;
                const player = yield playerModel_1.Player.create({
                    id: currentPlayer.id,
                    name: currentPlayer.name,
                    firstname: currentPlayer.firstname,
                    lastname: currentPlayer.lastname,
                    image: currentPlayer.photo, // Assuming 'photo' is correct and exists in your data model
                    age: currentPlayer.age,
                    nationality: currentPlayer.nationality,
                });
                // Consider handling the promise (await) results here, like logging or further processing
            }
        }
    }
});
const getTeamsData = () => __awaiter(void 0, void 0, void 0, function* () {
    // Initial call to get the total number of pages
    let data = yield (0, useAPI_1.useAPI)("get", `/teams?league=39&season=2023`);
    // Process each player on the current page
    for (let teamData of data.response) {
        const currentTeam = teamData.team;
        const team = yield teamModel_1.Team.create({
            id: currentTeam.id,
            name: currentTeam.name,
            country: currentTeam.country,
            logo: currentTeam.logo,
        });
    }
});
const checkTrending = () => __awaiter(void 0, void 0, void 0, function* () {
    const tokenizer = new natural_1.default.WordTokenizer();
    try {
        yield redis_1.default.del("trending_words");
        // Fetch recent posts within the last hour
        const oneHourAgo = new Date(Date.now() - 3600000);
        const recentPosts = yield postModel_1.Post.find({
            createdAt: { $gte: oneHourAgo },
        });
        // Process each post
        recentPosts.forEach((post) => __awaiter(void 0, void 0, void 0, function* () {
            const content = post.content;
            const tokens = tokenizer.tokenize(content);
            const filteredTokens = (0, stopword_1.removeStopwords)(tokens);
            // Increment word counts in Redis
            filteredTokens.forEach((word) => __awaiter(void 0, void 0, void 0, function* () {
                const cleanWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                yield redis_1.default.zIncrBy("trending_words", 1, cleanWord);
            }));
        }));
        yield redis_1.default.zRangeWithScores("trending_words", 0, 4, {
            REV: true,
        });
    }
    catch (error) {
        console.error("Error processing trending words:", error);
    }
});
const checkTeamSeasons = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const team_id of TEAM_IDS) {
        let data = yield (0, useAPI_1.useAPI)("get", `/teams/seasons?team=${team_id}`);
        if (data.results) {
            cacheData(`seasons-${team_id}`, data.response);
        }
    }
});
const checkTeamLeagues = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const team_id of TEAM_IDS) {
        const availableSeasonsString = yield redis_1.default.get(`seasons-${team_id}`);
        // Remove square brackets and trim whitespace
        const availableSeasons = availableSeasonsString === null || availableSeasonsString === void 0 ? void 0 : availableSeasonsString.replace(/[\[\]]/g, "").trim().split(",");
        console.log(availableSeasons);
        availableSeasons === null || availableSeasons === void 0 ? void 0 : availableSeasons.forEach((season) => __awaiter(void 0, void 0, void 0, function* () {
            for (const team_id of TEAM_IDS) {
                let data = yield (0, useAPI_1.useAPI)("get", `/leagues?team=${team_id}&season=${season}`);
                if (data.results) {
                    cacheData(`leagues-${team_id}-season-${season}`, data.response);
                }
            }
        }));
    }
});
const checkTeamStats = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const team_id of TEAM_IDS) {
        const availableSeasonsString = yield redis_1.default.get(`seasons-${team_id}`);
        // Remove square brackets and trim whitespace
        const availableSeasons = availableSeasonsString === null || availableSeasonsString === void 0 ? void 0 : availableSeasonsString.replace(/[\[\]]/g, "").trim().split(",");
        for (const season of availableSeasons) {
            let leagues = yield redis_1.default.get(`leagues-${team_id}-season-${season}`);
            let leagueData = leagues ? JSON.parse(leagues) : {};
            if (Object.keys(leagueData).length > 0) {
                const statsArr = [];
                console.log(leagueData);
                for (const entry of leagueData) {
                    let data = yield (0, useAPI_1.useAPI)("get", `/teams/statistics?team=${team_id}&season=${season}&league=${entry.league.id}`);
                    if (data.results) {
                        console.log(data.response);
                        statsArr.push(data.response);
                    }
                }
                cacheData(`team-${team_id}-stats-${season}`, statsArr);
            }
        }
    }
});
const checkTeamInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const team_id of TEAM_IDS) {
        let data = yield (0, useAPI_1.useAPI)("get", `/teams?id=${team_id}`);
        if (data.results) {
            console.log(data.response);
            cacheData(`team-${team_id}-info`, data.response[0]);
        }
    }
});
const checkTeamSquads = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const team_id of TEAM_IDS) {
        let data = yield (0, useAPI_1.useAPI)("get", `/players/squads?team=${team_id}`);
        if (data.results) {
            cacheData(`squad-${team_id}`, data.response[0].players);
        }
    }
});
const checkTeamFixtures = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const team_id of TEAM_IDS) {
        let data = yield (0, useAPI_1.useAPI)("get", `/fixtures/?team=${team_id}&season=2023`);
        if (data.results) {
            cacheData(`fixtures-${team_id}`, data.response);
        }
    }
});
const checkTeamStandings = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const team_id of TEAM_IDS) {
        let data = yield (0, useAPI_1.useAPI)("get", `/standings/?team=${team_id}&season=2023`);
        if (data.results) {
            console.log(data.response);
            cacheData(`standings-${team_id}`, data.response);
        }
    }
});
const checkTeamTransfers = () => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield (0, useAPI_1.useAPI)("get", `/transfers/?team=40`);
    if (data.results) {
        console.log(data.response);
        const filteredData = data.response.filter((item) => {
            // Define the cut-off date of July 1st, 2023
            const cutOffDate = new Date("2023-07-01");
            // Check if any transfer within the 'transfers' array is after July 1st, 2023
            return item.transfers.some((transfer) => {
                const transferDate = new Date(transfer.date);
                return transferDate > cutOffDate;
            });
        });
        cacheData(`transfers-40`, filteredData);
    }
});
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
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fetchWithRetry = (url_1, ...args_1) => __awaiter(void 0, [url_1, ...args_1], void 0, function* (url, retries = 4) {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = yield (0, useAPI_1.useAPI)("get", url);
            return response;
        }
        catch (error) {
            if (attempt === retries - 1) {
                console.error(`Failed to fetch ${url} after ${retries} attempts:`, error);
                throw error;
            }
            yield delay(3000); // Wait 1 second before retrying
        }
    }
});
const processPlayer = (player) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let [res1, res2, res3] = yield Promise.all([
            fetchWithRetry(`/players/?id=${player.id}&season=2023`),
            fetchWithRetry(`/trophies/?player=${player.id}`),
            fetchWithRetry(`/transfers/?player=${player.id}`),
        ]);
        let playerData = res1.response[0];
        let trophies = res2.response;
        let transfers = res3.response[0];
        let playerObj = Object.assign(Object.assign({}, playerData), { trophies, transfers });
        console.log(playerObj);
        yield cacheData(`player-${player.id}`, playerObj);
    }
    catch (error) {
        console.error(`Failed to fetch data for player ${player.id}:`, error);
    }
});
const getP = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const team_id of TEAM_IDS) {
        try {
            let squad = yield redis_1.default.get(`squad-${team_id}`);
            let squadArray = squad && JSON.parse(squad);
            if (squadArray) {
                for (const player of squadArray) {
                    yield processPlayer(player);
                    yield delay(200); // Wait 200 milliseconds before processing the next player
                }
            }
        }
        catch (error) {
            console.error(`Failed to fetch squad for team ${team_id}:`, error);
        }
    }
});
const dailyJobs = () => __awaiter(void 0, void 0, void 0, function* () {
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
    (0, node_schedule_1.scheduleJob)("32 13 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        yield checkTrending();
    }));
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
    (0, node_schedule_1.scheduleJob)("57 14 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        yield getStandingsFromAPI();
    }));
    // scheduleJob("17 00 * * *", async () => {
    //   await getP()
    // })
});
exports.dailyJobs = dailyJobs;
