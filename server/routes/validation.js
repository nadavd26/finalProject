const express = require("express")
const { validateInputTables, validateTable1Algo1, validateAlgo1} = require("../controllers/validation")
const router = express.Router()
router.route("/validateInputTables").get(validateInputTables)
router.route("/validateTable1Algo1").get(validateTable1Algo1)
router.route("/validateAlgo1").post(validateAlgo1)
module.exports = router;