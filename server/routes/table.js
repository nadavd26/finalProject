const express = require("express")
const { setTable, getTable, sortTable } = require("../controllers/user")
const router = express.Router()
router.route("/:tableNum").post(setTable).get(getTable);
router.route("/Sort/:tableNum").post(sortTable)
module.exports = router;