const TablesService = require("../services/tables")
const UserService = require("../services/user");

const setTable = async (req, res) => {
    try {
        content = JSON.parse(req.body.content)
        if (!TablesService.validateTable(content, parseInt(req.params.tableNum)))
            res.status(404).send("Invalid table.")
        else {
            if (req.params.tableNum != 1 && req.params.tableNum != 2 && req.params.tableNum != 3) {
                res.status(404).send("Invalid table number.")
            } else {
                await UserService.setTable(req.user.email, req.user.googleId, content, req.params.tableNum, req.user._id)
                res.sendStatus(200)
            }
        }
    } catch (err) {
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
}

const getTable = async (req, res) => {
    try {
        if (req.params.tableNum != 1 && req.params.tableNum != 2 && req.params.tableNum != 3) {
            res.status(404).send("Invalid table number.")
            return
        }
        tableContent = await UserService.getTable(req.user.email, req.user.googleId, req.params.tableNum)
        if (JSON.stringify(tableContent) != JSON.stringify([]))
            res.status(200).send(tableContent);
        else
            res.status(404).send("Invalid table number or table number that was never set.")
    } catch (err) {
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
}

const sortTable = (req, res) => {
    table = JSON.parse(req.body.content)
    const sortedTable = TablesService.sortTable(table, parseInt(req.params.tableNum))
    res.status(200).send({ content: sortedTable })
}

module.exports = {setTable, getTable, sortTable}
