const express = require("express")
const { returnResults1, editResults1, returnResults2, editResults2 } = require("../controllers/user")
const router = express.Router()
router.route("/GetResults1").get(returnResults1).post(editResults1)
router.route("/GetResults2").get(returnResults2).post(editResults2)
module.exports = router;