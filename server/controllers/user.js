const UserService = require("../services/user");
const TablesService = require("../services/tables")
const TableValidator = require("../services/tableValidator")
const ResultsService = require("../services/results")
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    try {
        await UserService.createUser(
            req.body.email,
            req.body.familyName,
            req.body.givenName,
            req.body.googleId,
            req.body.imageUrl,
            req.body.name
        );
        //Creating token
        let user = await UserService.getUser(req.body.email, req.body.googleId)
        if (user != null) {
            user = user.toObject();
            const token = jwt.sign(user, process.env.SECRET_KEY);
            res.status(200).send(token);
        }
    } catch (err) {
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
};

const login = async (req, res) => {
    try {
        bool = await UserService.isUserInDBByEmail(req.body.email)
        if (bool) {   //Checking if the user is in the DB.
            //Creating token
            let user = await UserService.getUser(req.body.email, req.body.googleId)
            if (user != null) {
                user = user.toObject();
                const token = jwt.sign(user, process.env.SECRET_KEY);
                res.status(200).send(token);
            }
        }
        else { //Need to add him to the DB.
            await createUser(req, res);
        }
    } catch (err) {
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
}

const setTable = async (req, res) => {
    try {
        content = JSON.parse(req.body.content)
        if (!TablesService.validateTable(content, parseInt(req.params.tableNum)))
            res.status(404).send("Invalid table.")
        else {
            if (req.params.tableNum != 1 && req.params.tableNum != 2 && req.params.tableNum != 3) {
                res.status(404).send("Invalid table number.")
            } else {
                await UserService.setTable(req.user.email, req.user.googleId, content, req.params.tableNum)
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

const generateResults1 = async (req, res) => {
    const table2 = await UserService.getTable(req.user.email, req.user.googleId, 2)
    if (JSON.stringify(table2) == JSON.stringify([]))
        res.status(404).send("At least one of the tables were never set.")
    const table3 = await UserService.getTable(req.user.email, req.user.googleId, 3)
    if (JSON.stringify(table3) == JSON.stringify([]))
        res.status(404).send("At least one of the tables were never set.")
    /*if (!TableValidator.validateAlgoRequirements(table2.table2Content, table3.table3Content))
        res.status(404).send("Invalid input tables: there is a shift with a day or skiill that is not in the requirements.")*/
    else {
        // Call getResults1 and wait for its completion
        const results = await ResultsService.getResults1(table2.table2Content, table3.table3Content, req.user._id);
        const resultsMap = await ResultsService.saveResults(results, req.user._id)
        // Convert the map to a plain object before sending
        const serializedResults = {};
        for (const [key, value] of resultsMap.entries()) {
            serializedResults[key] = value;
        }
        res.status(200).send(serializedResults);
    }
}

const returnResults1 = async (req, res) => {
    try {
        if (req.query.getFromDatabase === 'false') {
            await generateResults1(req, res);
        } else if (req.query.getFromDatabase === 'true') {
            const resultsMap = await ResultsService.getResults1FromDB(req.user._id)
            if (resultsMap.size === 0) {
                await generateResults1(req, res); //If there are no results in the DB we generate them.
            } else {
                const serializedResults = {};
                for (const [key, value] of resultsMap.entries()) {
                    serializedResults[key] = value;
                }
                res.status(200).send(serializedResults);
            }
        } else {
            res.status(404).send("Invalid getFromDatabase value.")
        }
    } catch (err) {
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
}

// This function deletes the existing result under the key of the first line in the given data, and replaces
// it with the lines that are given by the client.
const editResults1 = async (req, res) => {
    dataToEdit = JSON.parse(req.body.content)
    await ResultsService.editResults(dataToEdit, req.user._id)
    res.sendStatus(200)
}

const generateResults2 = async (req, res) => {
    const results1 = await ResultsService.getResults1FromDB(req.user._id)
    if (results1.size == 0)
        res.status(404).send("There are no shift tables.")
    else {
        // Call getResults1 and wait for its completion
        const results = await ResultsService.getResults2(req.user._id);
        await ResultsService.saveResults2(results, req.user._id)
        res.status(200).send(results);
    }
}

const returnResults2 = async (req, res) => {
    try {
        if (req.query.getFromDatabase === 'false') {
            await generateResults2(req, res)
        } else if (req.query.getFromDatabase === 'true') {
            const resultsMap = await ResultsService.getResults2FromDB(req.user._id)
            if (resultsMap.size === 0) {
                await generateResults2(req, res); //If there are no results in the DB we generate them.
            } else {
                const serializedResults = {};
                for (const [key, value] of resultsMap.entries()) {
                    serializedResults[key] = value;
                }
                res.status(200).send(serializedResults);
            }
        } else {
            res.status(404).send("Invalid getFromDatabase value.")
        }
    } catch (err) {
        console.log(err)
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
}

// This function deletes the existing results and replacing it with the given table.
const editResults2 = async (req, res) => {
    await ResultsService.editResults2(req, req.user._id)
    res.sendStatus(200)
}

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
        if (info1[0] && info2[0] && info3[0]) { //Checking if everything is valid.
            res.sendStatus(200)
        } else {
            const errorMsg = (info1[0] ? "" : info1[1] + "\n") +
                (info2[0] ? "" : info2[1] + "\n") +
                (info3[0] ? "" : info3[1] + "\n")
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
module.exports = { login, createUser, setTable, getTable, sortTable, returnResults1, editResults1, returnResults2, editResults2, validateInputTables, validateTable1Algo1, validateAlgo1 }