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
exports.dataController = void 0;
const axios_1 = __importDefault(require("axios"));
const playerModel_1 = require("../models/playerModel");
const redis_1 = __importDefault(require("../loaders/redis"));
const teamModel_1 = require("../models/teamModel");
const postModel_1 = require("../models/postModel");
exports.dataController = {
    getFixture: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { id } = req.params;
        try {
            const fixture = yield redis_1.default.get(`fixture-${id}`);
            return res.status(200).send(fixture);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getTrending: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const trending = yield redis_1.default.zRangeWithScores("trending_words", 0, 9, {
                REV: true,
            });
            return res.status(200).send(trending);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getHeadToHead: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { h2h } = req.params;
        try {
            let config = {
                headers: {
                    "x-rapidapi-host": "v3.football.api-sports.io",
                    "x-rapidapi-key": "2b04dc0863c0897b2360fb19617d642f",
                },
            };
            const response = yield axios_1.default.get(`https://v3.football.api-sports.io/fixtures/headtohead?h2h=${h2h}&last=5`, config);
            const data = response.data.response;
            return res.status(200).send(data);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getFixtureEvents: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { id } = req.params;
        try {
            let config = {
                headers: {
                    "x-rapidapi-host": "v3.football.api-sports.io",
                    "x-rapidapi-key": "2b04dc0863c0897b2360fb19617d642f",
                },
            };
            const response = yield axios_1.default.get(`https://v3.football.api-sports.io/fixtures/events?fixture=${id}`, config);
            const events = response.data.response;
            return res.status(200).send(events);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getTodaysFixtures: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const todaysFixtures = yield redis_1.default.get("todays-fixtures");
            return res.status(200).send(todaysFixtures);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getStandings: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { id } = req.params;
        try {
            const standings = yield redis_1.default.get(`standings-league-${id}`);
            return res.status(200).send(standings);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getSearchResults: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { type, query } = req.params;
        try {
            if (type === "players") {
                const results = yield playerModel_1.Player.find({
                    name: { $regex: new RegExp(query, "i") },
                });
                return res.status(200).send({ results: results, type: "players" });
            }
            else if (type === "teams") {
                const results = yield teamModel_1.Team.find({
                    name: { $regex: new RegExp(query, "i") },
                });
                return res.status(200).send({ results: results, type: "teams" });
            }
            else if (type === "posts") {
                const results = yield postModel_1.Post.find({
                    content: { $regex: new RegExp(query, "i") },
                }).populate("user");
                return res.status(200).send({ results: results, type: "posts" });
            }
            else {
                return res.status(200).send("no results found");
            }
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    checkTodaysFixtures: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { id } = req.params;
        try {
            const todaysFixturesString = yield redis_1.default.get(`todays-fixtures`);
            if (todaysFixturesString === null) {
                return res.status(404).send("No fixtures for today.");
            }
            const fixtureIdToCheck = parseInt(id);
            const todaysFixtures = JSON.parse(todaysFixturesString);
            const isFixturePresent = todaysFixtures.some((fixture) => fixture.id === fixtureIdToCheck);
            if (isFixturePresent) {
                return res.status(200).send(true);
            }
            else {
                return res.status(200).send(false);
            }
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getPlayer: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { id } = req.params;
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
            const player = yield redis_1.default.get(`player-${id}`);
            return res.status(200).send(player);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getTeam: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { id } = req.params;
        try {
            let infoData = yield redis_1.default.get(`team-${id}-info`);
            let info = infoData ? JSON.parse(infoData) : {};
            return res.status(200).send(info);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getFixtures40: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield redis_1.default.get("fixtures-40");
            return res.status(200).send(response);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getTeamL: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield redis_1.default.get("team-40-L");
            return res.status(200).send(response);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getTeamStats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { id } = req.params;
            let { season } = req.query;
            console.log(id, season);
            const response = yield redis_1.default.get(`team-${id}-stats-${season}`);
            console.log(response);
            return res.status(200).send(response);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getTeamSquad: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { id } = req.params;
        try {
            const response = yield redis_1.default.get(`squad-${id}`);
            return res.status(200).send(response);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getTeamFixtures: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { id } = req.params;
        try {
            const response = yield redis_1.default.get(`fixtures-${id}`);
            return res.status(200).send(response);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getTeamStandings: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { id } = req.params;
        try {
            const response = yield redis_1.default.get(`standings-${id}`);
            return res.status(200).send(response);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
    getTeamTransfers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { id } = req.params;
        try {
            const response = yield redis_1.default.get(`transfers-${id}`);
            return res.status(200).send(response);
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).send(error.message);
            }
            return res.status(500).send({ error: "Unknown server error occurred" });
        }
    }),
};
