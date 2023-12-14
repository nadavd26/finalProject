const express = require("express")
const router = express.Router()
router.route("/").post((req, res) => { res.status(200).send("Authorized!") });
module.exports = router;