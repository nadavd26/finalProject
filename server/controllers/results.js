const UserService = require("../services/user");
const ResultsService = require("../services/results");
const TableValidator = require("../services/tableValidator")


const generateResults1 = async (req, res) => {
    const table2 = await UserService.getTable(req.user.email, req.user.googleId, 2);
    if (JSON.stringify(table2) == JSON.stringify([])) {
        res.status(404).send("At least one of the tables were never set.");
        return;
    }
    const table3 = await UserService.getTable(req.user.email, req.user.googleId, 3);
    if (JSON.stringify(table3) == JSON.stringify([])) {
        res.status(404).send("At least one of the tables were never set.");
        return;
    }
    // Commented out code related to validation
    // if (!TableValidator.validateAlgoRequirements(table2.table2Content, table3.table3Content)) {
    //     res.status(404).send("Invalid input tables: there is a shift with a day or skill that is not in the requirements.");
    //     return;
    // }
    const results = await ResultsService.getResults1(table2.table2Content, table3.table3Content, req.user._id);
    console.log("python stop")
    const resultsMap = await ResultsService.saveResults(results, req.user._id);
    console.log("save stop")
    const serializedResults = {};
    for (const [key, value] of resultsMap.entries()) {
        serializedResults[key] = value;
    }
    res.status(200).send(serializedResults);
};

const returnResults1 = async (req, res) => {
    try {
        if (req.query.getFromDatabase === 'false') {
            await generateResults1(req, res);
        } else if (req.query.getFromDatabase === 'true') {
            const resultsMap = await ResultsService.getResults1FromDB(req.user._id);
            if (resultsMap.size === 0) {
                await generateResults1(req, res);
            } else {
                const serializedResults = serializedResultsFromDB(resultsMap);
                res.status(200).send(serializedResults);
            }
        } else {
            res.status(404).send("Invalid getFromDatabase value.");
        }
    } catch (err) {
        console.error("returnResults1: Caught error", err);
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
};

// This function deletes the existing result under the key of the first line in the given data, and replaces
// it with the lines that are given by the client.
const editResults1 = async (req, res) => {
    const dataToEdit = JSON.parse(req.body.content);
    await ResultsService.editResults(dataToEdit, req.user._id);
    res.sendStatus(200);
};

const generateResults2 = async (req, res) => {
    const results1 = await ResultsService.getResults1FromDB(req.user._id);
    if (results1.size == 0) {
        res.status(404).send("There are no shift tables.");
        return;
    }
    let resultsBeforeDB = ''
    if (req.query.empty === 'true') {
        resultsBeforeDB = await ResultsService.getEmptyResults2(req.user._id)
    } else {
        resultsBeforeDB = await ResultsService.getResults2(req.user._id, req.query.autoComplete); //Generating results2, does not include ID as it is created by DB.
    }
    await ResultsService.saveResults2(resultsBeforeDB, req.user._id);
    const results = await ResultsService.getResults2FromDB(req.user._id)
    const serializedResults = serializedResultsFromDB(results);
    res.status(200).send(serializedResults);
};

const returnResults2 = async (req, res) => {
    try {
        if (req.query.getFromDatabase === 'false') {
            await generateResults2(req, res);
        } else if (req.query.getFromDatabase === 'true') {
            const resultsMap = await ResultsService.getResults2FromDB(req.user._id);
            const bit = await TableValidator.getTableBit(req.user._id, 5)
            if(!bit) {
                res.status(404).send("The previus results are not relevant anymore.")
            }
            else if (resultsMap.size === 0) {
                await generateResults2(req, res);
            } else {
                const serializedResults = serializedResultsFromDB(resultsMap);
                res.status(200).send(serializedResults);
            }
        } else {
            res.status(404).send("Invalid getFromDatabase value.");
        }
    } catch (err) {
        console.error("returnResults2: Caught error", err);
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
};

//Transfoms the results from the map format that is returned from the DB to the format sent to the client.
//Assuming that there are results in the DB.
const serializedResultsFromDB = (resultsMap) => {
    const serializedResults = {};
    for (const [key, value] of resultsMap.entries()) {
        serializedResults[key] = value;
    }
    return serializedResults;
}

// This function deletes the existing results and replaces it with the given table.
const editResults2 = async (req, res) => {
    try {
        await ResultsService.editResults2(req, req.user._id);
        res.sendStatus(200);
    } catch (err) {
        res.status(409).send(err.message)
    }
}

module.exports = { returnResults1, editResults1, returnResults2, editResults2 };
