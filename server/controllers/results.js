const UserService = require("../services/user");
const ResultsService = require("../services/results")

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

module.exports = {returnResults1, editResults1, returnResults2, editResults2}