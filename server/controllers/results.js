const UserService = require("../services/user");
const ResultsService = require("../services/results");

const generateResults1 = async (req, res) => {
    console.log("generateResults1: Starting function");
    const table2 = await UserService.getTable(req.user.email, req.user.googleId, 2);
    console.log("generateResults1: table2 fetched", table2);

    if (JSON.stringify(table2) == JSON.stringify([])) {
        console.log("generateResults1: table2 is empty, sending 404");
        res.status(404).send("At least one of the tables were never set.");
        return;
    }

    const table3 = await UserService.getTable(req.user.email, req.user.googleId, 3);
    console.log("generateResults1: table3 fetched", table3);

    if (JSON.stringify(table3) == JSON.stringify([])) {
        console.log("generateResults1: table3 is empty, sending 404");
        res.status(404).send("At least one of the tables were never set.");
        return;
    }

    // Commented out code related to validation
    // if (!TableValidator.validateAlgoRequirements(table2.table2Content, table3.table3Content)) {
    //     res.status(404).send("Invalid input tables: there is a shift with a day or skill that is not in the requirements.");
    //     return;
    // }

    const results = await ResultsService.getResults1(table2.table2Content, table3.table3Content, req.user._id);
    console.log("generateResults1: results from getResults1", results);

    const resultsMap = await ResultsService.saveResults(results, req.user._id);
    console.log("generateResults1: results saved to resultsMap", resultsMap);

    const serializedResults = {};
    for (const [key, value] of resultsMap.entries()) {
        serializedResults[key] = value;
    }
    console.log("generateResults1: serializedResults", serializedResults);

    res.status(200).send(serializedResults);
    console.log("generateResults1: Response sent");
};

const returnResults1 = async (req, res) => {
    try {
        console.log("returnResults1: Starting function");
        if (req.query.getFromDatabase === 'false') {
            console.log("returnResults1: Generating results because getFromDatabase is false");
            await generateResults1(req, res);
        } else if (req.query.getFromDatabase === 'true') {
            console.log("returnResults1: Fetching results from DB because getFromDatabase is true");
            const resultsMap = await ResultsService.getResults1FromDB(req.user._id);
            console.log("returnResults1: resultsMap from DB", resultsMap);

            if (resultsMap.size === 0) {
                console.log("returnResults1: No results in DB, generating them");
                await generateResults1(req, res);
            } else {
                const serializedResults = serializedResultsFromDB(resultsMap);
                console.log("returnResults1: Returning serializedResults from DB", serializedResults);
                res.status(200).send(serializedResults);
            }
        } else {
            console.log("returnResults1: Invalid getFromDatabase value, sending 404");
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
    console.log("editResults1: Starting function");
    const dataToEdit = JSON.parse(req.body.content);
    console.log("editResults1: dataToEdit parsed", dataToEdit);

    await ResultsService.editResults(dataToEdit, req.user._id);
    console.log("editResults1: Results edited");

    res.sendStatus(200);
    console.log("editResults1: Response sent");
};

const generateResults2 = async (req, res) => {
    console.log("generateResults2: Starting function");
    const results1 = await ResultsService.getResults1FromDB(req.user._id);
    console.log("generateResults2: results1 from DB", results1);

    if (results1.size == 0) {
        console.log("generateResults2: No shift tables found, sending 404");
        res.status(404).send("There are no shift tables.");
        return;
    }

    const resultsBeforeDB = await ResultsService.getResults2(req.user._id); //Generating results2, does not include ID as it is created by DB.
    console.log("generateResults2: results from getResults2", resultsBeforeDB);

    await ResultsService.saveResults2(resultsBeforeDB, req.user._id);
    console.log("generateResults2: results saved");

    const results = await ResultsService.getResults2FromDB(req.user._id)
    console.log("Results2 from DB: " + results)

    const serializedResults = serializedResultsFromDB(results);
    console.log("SerializedResults2: " + serializedResults)

    res.status(200).send(serializedResults);
    console.log("generateResults2: Response sent");
};

const returnResults2 = async (req, res) => {
    try {
        console.log("returnResults2: Starting function");
        if (req.query.getFromDatabase === 'false') {
            console.log("returnResults2: Generating results because getFromDatabase is false");
            await generateResults2(req, res);
        } else if (req.query.getFromDatabase === 'true') {
            console.log("returnResults2: Fetching results from DB because getFromDatabase is true");
            const resultsMap = await ResultsService.getResults2FromDB(req.user._id);
            console.log("returnResults2: resultsMap from DB", resultsMap);

            if (resultsMap.size === 0) {
                console.log("returnResults2: No results in DB, generating them");
                await generateResults2(req, res);
            } else {
                const serializedResults = serializedResultsFromDB(resultsMap);
                console.log("returnResults2: Returning serializedResults from DB", serializedResults);
                res.status(200).send(serializedResults);
            }
        } else {
            console.log("returnResults2: Invalid getFromDatabase value, sending 404");
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
    console.log("editResults2: Starting function");
    try {
        await ResultsService.editResults2(req, req.user._id);
        console.log("editResults2: Results edited");

        res.sendStatus(200);
        console.log("editResults2: Response sent");
    } catch (err) {
        res.status(409).send(err.message)
    }
}

module.exports = { returnResults1, editResults1, returnResults2, editResults2 };
