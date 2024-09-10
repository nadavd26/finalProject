const User = require("../models/user");
const Tables = require("./tables")

const createUser = async (email, familyName, givenName, googleId, imageUrl, name) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error("User has already signed in once.");
        const user = new User({
            email, familyName, givenName, googleId, imageUrl, name, table1: [], table2: [], table3: [],
        });
        return await user.save();
    } catch (err) {
        throw err;
    }
};

const isUserInDBByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            return true;
        } else {
            return false; // User not found
        }
    } catch (error) {
        throw false;
    }
};

const getUser = async (email, googleId) => {
    const user = await User.findOne({ email, googleId });
    if (user === null) throw new Error("Incorrect email or google id.");
    const newUser = new User({
        email: user.email,
        givenName: user.givenName,
        googleId: user.googleId,
        familyName: user.familyName,
        name: user.name
    });
    newUser._id = user._id;
    return newUser;
}

const setTable = async (email, googleId, tableContent, tableNum, userId) => {
    try {
        if (!tableContent || !Array.isArray(tableContent)) {
            throw new Error("Invalid table content");
        }
        // Removing existing lines
        const tableField = `table${tableNum}`;
        // Getting old TableLine IDs
        const oldTableLineIds = (await User.findOne({ email, googleId }))[tableField];
        // Removing existing lines from User document
        await User.findOneAndUpdate({ email, googleId }, { $set: { [tableField]: [] } });
        // Removing those lines from the TableLine doccument.
        await Tables.removeLinesByIds(parseInt(tableNum), oldTableLineIds)
        /*await TableLine.deleteMany({
            _id: { $in: oldTableLineIds }
        });*/
        /*const tableLines = [];
        // Creating TableLine objects and save them in the database
        for (const lineData of tableContent) {
            const tableLine = new TableLine({
                day: lineData[0],
                skill: lineData[1],
                startTime: lineData[2],
                finishTime: lineData[3],
                requiredNumOfWorkers: lineData[4],
            });
            const savedLine = await tableLine.save();
            tableLines.push(savedLine._id);
        }
        // Updating the user's table array with the created TableLine objects
        await User.findOneAndUpdate(
            { email, googleId },
            { $addToSet: { [tableField]: { $each: tableLines } } }
        );*/
        await Tables.updateTable(parseInt(tableNum), tableContent, email, googleId, userId)
    } catch (err) {
        throw err
    }
}

const getTable = async (email, googleId, tableNum) => {
    if (tableNum != 1 && tableNum != 2 && tableNum != 3) //Checking for invalid table number.
        return []
    const tableField = `table${tableNum}`;
    const user = await User.findOne({ email, googleId }).populate(tableField);
    const tableContent = user[tableField] || [];
    const formattedTable = Tables.formatTable(parseInt(tableNum), tableContent)
    if (JSON.stringify(formattedTable) == JSON.stringify([]))
        return []
    return { [`table${tableNum}Content`]: formattedTable };
}

const getTableByUserId = async (userId, tableNum) => {
    if (tableNum != 1 && tableNum != 2 && tableNum != 3) //Checking for invalid table number.
        return []
    const tableField = `table${tableNum}`;
    const user = await User.findById(userId).populate(tableField);
    const tableContent = user[tableField] || [];
    const formattedTable = Tables.formatTable(parseInt(tableNum), tableContent)
    if (JSON.stringify(formattedTable) == JSON.stringify([]))
        return []
    return { [`table${tableNum}Content`]: formattedTable };
}

module.exports = { createUser, isUserInDBByEmail, getUser, setTable, getTable, getTableByUserId }

