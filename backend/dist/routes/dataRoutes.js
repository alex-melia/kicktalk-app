"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataRoutes = void 0;
const express_1 = __importDefault(require("express"));
const dataController_1 = require("../controllers/dataController");
const router = express_1.default.Router();
exports.dataRoutes = router;
router.get("/fixtures40", dataController_1.dataController.getFixtures40);
router.get("/L40", dataController_1.dataController.getTeamL);
router.get("/todays-fixtures", dataController_1.dataController.getTodaysFixtures);
router.get("/trending", dataController_1.dataController.getTrending);
router.get("/fixture/:id", dataController_1.dataController.getFixture);
router.get("/fixture/headtohead/:h2h", dataController_1.dataController.getHeadToHead);
router.get("/fixture/events/:id", dataController_1.dataController.getFixtureEvents);
// router.get("/fixtures/:id", dataController.getFixtures)
router.get("/standings/:id", dataController_1.dataController.getStandings);
router.get("/search/:type/:query", dataController_1.dataController.getSearchResults);
router.get("/player/:id", dataController_1.dataController.getPlayer);
router.get("/team/:id", dataController_1.dataController.getTeam);
router.get("/todays-fixtures/:id", dataController_1.dataController.checkTodaysFixtures);
router.get("/team-stats/:id", dataController_1.dataController.getTeamStats);
router.get("/squad/:id", dataController_1.dataController.getTeamSquad);
router.get("/fixtures/:id", dataController_1.dataController.getTeamFixtures);
router.get("/team-standings/:id", dataController_1.dataController.getTeamStandings);
router.get("/transfers/:id", dataController_1.dataController.getTeamTransfers);
