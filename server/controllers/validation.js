const UserService = require("../services/user");
const TableValidator = require("../services/tableValidator")
const ResultsService = require("../services/results")

const validateInputTables = async (req, res) => {
    const table1 = await UserService.getTable(req.user.email, req.user.googleId, 1)
    const table2 = await UserService.getTable(req.user.email, req.user.googleId, 2)
    const table3 = await UserService.getTable(req.user.email, req.user.googleId, 3)
    if (JSON.stringify(table1) == JSON.stringify([]))
        res.status(404).send("Table1 was never set.")
    else if (JSON.stringify(table2) == JSON.stringify([]))
        res.status(404).send("Table2 was never set.")
    else if (JSON.stringify(table3) == JSON.stringify([]))
        res.status(404).send("Table3 was never set.")
    else {
        const info1 = TableValidator.validateTable2NumOfWorkers(table1.table1Content, table2.table2Content)
        const info2 = TableValidator.validateTable2SkillsInTable3(table2.table2Content, table3.table3Content)
        const info3 = TableValidator.validateTable3SkillsInTable2(table2.table2Content, table3.table3Content)
        const info4 = TableValidator.validateTable3SkillsInTable1(table1.table1Content, table3.table3Content)
        const info5 = TableValidator.validateTable2SkillsInTable1(table1.table1Content, table2.table2Content)
        const info6 = TableValidator.validateTable1SkillsInTable3(table1.table1Content, table3.table3Content)
        const info7 = TableValidator.validateTable1SkillsInTable2(table1.table1Content, table2.table2Content)

        if (info1[0] && info2[0] && info3[0] && info4[0] && info5[0] && info6[0] && info6[2] && info7[0] && info7[2]) { //Checking if everything is valid.
            res.sendStatus(200)
        } else {
            const errorMsg = (info1[0] ? "" : info1[1] + "\n") +
                (info2[0] ? "" : info2[1] + "\n") +
                (info3[0] ? "" : info3[1] + "\n") +
                (info4[0] ? "" : info4[1] + "\n") +
                (info5[0] ? "" : info5[1] + "\n") +
                (info6[0] ? "" : info6[1] + "\n") +
                (info6[2] ? "" : info6[3] + "\n") +
                (info7[0] ? "" : info7[1] + "\n") +
                (info7[2] ? "" : info7[3] + "\n")
            res.status(404).send(errorMsg)
        }
    }
}

const validateTable1Algo1 = async (req, res) => {
    const table1 = await UserService.getTable(req.user.email, req.user.googleId, 1)
    const resultsMap = await ResultsService.getResults1FromDB(req.user._id)
    if (JSON.stringify(table1) == JSON.stringify([]))
        res.status(404).send("Table1 was never set.")
    else if (resultsMap.size === 0) {
        res.status(404).send("There is no shift schedule in the DB.")
    } else {
        const info = TableValidator.validateTable1Algo1(table1.table1Content, resultsMap)
        if (info[0]) { //Checking if everything is valid.
            res.sendStatus(200)
        } else {
            res.status(404).send(info[1])
        }
    }
}

const validateAlgo1 = async (req, res) => {
    const table1 = await UserService.getTable(req.user.email, req.user.googleId, 1)
    const resultsMap = await ResultsService.getResults1FromDB(req.user._id)
    if (JSON.stringify(table1) == JSON.stringify([]))
        res.status(404).send("Table1 was never set.")
    else if (resultsMap.size === 0) {
        res.status(404).send("There is no shift schedule in the DB.")
    } else {
        const info1 = TableValidator.validateTable1Algo1(table1.table1Content, resultsMap)
        const info2 = TableValidator.validateTable2NumOfWorkers(table1.table1Content, JSON.parse(req.body.content))
        if(info2[0]) {
            res.sendStatus(200)
        } else if(info1[0]) {
            res.status(404).send("The shift schedule in the DB is valid, but the given one is not.")
        } else {
            res.status(404).send("The shift schedule in the DB is valid, but the given one is not.")
        }
    }
}

module.exports = {validateInputTables, validateTable1Algo1, validateAlgo1}