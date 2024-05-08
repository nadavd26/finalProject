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

const returnResults = async (req, res) => {
    try {
        table2 = await UserService.getTable(req.user.email, req.user.googleId, 2)
        if (JSON.stringify(table2) == JSON.stringify([]))
            res.status(404).send("At least one of the tables were never set.")
        table3 = await UserService.getTable(req.user.email, req.user.googleId, 3)
        if (JSON.stringify(table3) == JSON.stringify([]))
            res.status(404).send("At least one of the tables were never set.")
        if (!TableValidator.validateAlgoRequirements(table2.table2Content, table3.table3Content))
            res.status(404).send("Invalid tables.")
        else {
            // Call getResults1 and wait for its completion
            const results = await ResultsService.getResults1(table2.table2Content, table3.table3Content, req.user._id);
            resultsMap = await ResultsService.saveResults(results, req.user._id)
            // Convert the map to a plain object before sending
            const serializedResults = {};
            for (const [key, value] of resultsMap.entries()) {
                serializedResults[key] = value;
            }
            res.status(200).send(serializedResults);
        }
    } catch (err) {
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
}

// This function deletes the existing result under the key of the first line in the given data, and replaces
// it with the lines that are given by the client.
const editResults = async (req, res) => {
    dataToEdit = JSON.parse(req.body.content)
    await ResultsService.editResults(dataToEdit, req.user._id)
    res.sendStatus(200)
}
module.exports = { login, createUser, setTable, getTable, sortTable, returnResults, editResults }