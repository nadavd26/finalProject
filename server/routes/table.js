const express = require("express")
const { setTable, getTable } = require("../controllers/user")
const router = express.Router()
router.route("/:tableNum").post(setTable).get(getTable);
module.exports = router;