const express = require("express")
const { returnResults, editResults } = require("../controllers/user")
const router = express.Router()
router.route("/GetResults1").get(returnResults).post(editResults)
module.exports = router;