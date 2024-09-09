const express = require("express")
const { setTable, getTable, sortTable } = require("../controllers/table")
const router = express.Router()
router.route("/:tableNum").post(setTable).get(getTable);
router.route("/Sort/:tableNum").post(sortTable)
router.route("/resTable2Info").get((req,res) => res.send("String"))
module.exports = router;