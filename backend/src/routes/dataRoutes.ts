import express from "express"
import { dataController } from "../controllers/dataController"

const router = express.Router()

router.get("/fixtures40", dataController.getFixtures40)
router.get("/L40", dataController.getTeamL)
router.get("/todays-fixtures", dataController.getTodaysFixtures)
router.get("/trending", dataController.getTrending)
router.get("/fixture/:id", dataController.getFixture)
router.get("/fixture/headtohead/:h2h", dataController.getHeadToHead)
router.get("/fixture/events/:id", dataController.getFixtureEvents)
// router.get("/fixtures/:id", dataController.getFixtures)

router.get("/standings/:id", dataController.getStandings)

router.get("/search/:type/:query", dataController.getSearchResults)

router.get("/player/:id", dataController.getPlayer)
router.get("/team/:id", dataController.getTeam)

router.get("/todays-fixtures/:id", dataController.checkTodaysFixtures)
router.get("/team-stats/:id", dataController.getTeamStats)
router.get("/squad/:id", dataController.getTeamSquad)
router.get("/fixtures/:id", dataController.getTeamFixtures)
router.get("/team-standings/:id", dataController.getTeamStandings)
router.get("/transfers/:id", dataController.getTeamTransfers)

export { router as dataRoutes }
