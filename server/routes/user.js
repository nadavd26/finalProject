const express = require("express")
const { login, createUser } = require("../controllers/user.js")
const router = express.Router()
router.route("/").post(login);
module.exports = router;