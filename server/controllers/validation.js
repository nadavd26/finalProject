const UserService = require("../services/user");
const TableValidator = require("../services/tableValidator")
const ResultsService = require("../services/results")

const validateInputTables = async (req, res) => {
    const table1 = await UserService.getTable(req.user.email, req.user.googleId, 1)
    const table2 = await UserService.getTable(req.user.email, req.user.googleId, 2)
    const table3 = await UserService.getTable(req.user.email, req.user.googleId, 3)
    if (JSON.stringify(table1) == JSON.stringify([]))
        res.status(404).send({ type: "error", msg: "Table1 was never set." })
    else if (JSON.stringify(table2) == JSON.stringify([]))
        res.status(404).send({ type: "error", msg: "Table2 was never set." })
    else if (JSON.stringify(table3) == JSON.stringify([]))
        res.status(404).send({ type: "error", msg: "Table3 was never set." })
    else {
        const info1 = TableValidator.validateTable2NumOfWorkers(table1.table1Content, table2.table2Content)
        const info2 = TableValidator.validateTable2SkillsInTable3(table2.table2Content, table3.table3Content)
        const info3 = TableValidator.validateTable3SkillsInTable2(table2.table2Content, table3.table3Content)
        const info4 = TableValidator.validateTable3SkillsInTable1(table1.table1Content, table3.table3Content)
        const info5 = TableValidator.validateTable2SkillsInTable1(table1.table1Content, table2.table2Content)
        const info6 = TableValidator.validateTable1SkillsInTable3(table1.table1Content, table3.table3Content)
        const info7 = TableValidator.validateTable1SkillsInTable2(table1.table1Content, table2.table2Content)
        const info8 = await TableValidator.getTableBit(req.user._id, 2)
        const info9 = await TableValidator.getTableBit(req.user._id, 3)
        const info10 = TableValidator.validateTable2NumOfWorkersWithSkill(table1.table1Content, table2.table2Content)
        if (!(info1[0] && info2[0] && info5[0])) { //Checking if everything is valid.
            const errorMsg = {
                type: "error", msg:
                    (info1[0] ? "" : info1[1] + "\n") +
                    (info2[0] ? "" : info2[1] + "\n") +
                    (info5[0] ? "" : info5[1] + "\n"), changed: info8 || info9
            }
            res.status(404).send(errorMsg)
        } else if (!(info3[0] && info4[0] && info6[0] && info7[0] && info6[2] && info7[2] && info10[0])) {
            const warningMsg = {
                type: "warning", msg:
                    (info1[0] ? "" : info1[1] + "\n") +
                    (info3[0] ? "" : info3[1] + "\n") +
                    (info4[0] ? "" : info4[1] + "\n") +
                    (info6[0] ? "" : info6[1] + "\n") +
                    (info6[2] ? "" : info6[3] + "\n") +
                    (info7[0] ? "" : info7[1] + "\n") +
                    (info7[2] ? "" : info7[3] + "\n") +
                    (info10[0] ? "" : info10[1] + "\n"), changed: info8 || info9
            }
            res.status(404).send(warningMsg)
        } else {
            res.status(200).send({ type: "success", msg: "", changed: info8 || info9 })
        }
    }
}

const validateTable1Algo1 = async (req, res) => {
    const table1 = await UserService.getTable(req.user.email, req.user.googleId, 1)
    const resultsMap = await ResultsService.getResults1FromDB(req.user._id)
    if (JSON.stringify(table1) == JSON.stringify([]))
        res.status(404).send({ type: "error", msg: "Table1 was never set." })
    else if (resultsMap.size === 0) {
        res.status(404).send({ type: "error", msg: "No manpower table." })
    } else {
        const info = TableValidator.validateTable1Algo1(table1.table1Content, resultsMap)
        const info2 = await TableValidator.getTableBit(req.user._id, 1)
        const info3 = await TableValidator.getTableBit(req.user._id, 4)
        if (info[0]) { //Checking if everything is valid.
            res.status(200).send({ type: "success", msg: "", changed: info2 || info3 })
        } else {
            res.status(404).send({ type: "warning", msg: info[0] ? "" : info[1], changed: info2 || info3 })
        }
    }
}

const validateAlgo2 = async (req, res) => {
    const userId = req.user._id
    const info1 = await TableValidator.validateAlgo2MinHours(userId)
    const info2 = await TableValidator.validateAlgo2MaxHours(userId)
    const info3 = await TableValidator.validateAlgo2ShiftWorkersRequirement(userId)
    if (!(info1[0] && info2[0] && info3[0])) { //Checking if everything is valid.
        const errorMsg =
                (info1[0] ? "" : info1[1] + "\n") +
                (info2[0] ? "" : info2[1] + "\n") +
                (info3[0] ? "" : info3[1] + "\n")
        res.send(errorMsg)
    } else {
        res.send('No issues were found.')
    }
}

module.exports = { validateInputTables, validateTable1Algo1, validateAlgo2 }