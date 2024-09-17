const User = require("../models/user");
const Tables = require("./tables")

//This function gets the relevant information and creates and saves the user in the DB with that info.
//Tables 1, 2, and 3 are set to be empty arrays as they will be set in future requests from the user.
//If there already is a user with that email, an error is thrown as we don't allow to different user with the same email.
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

//This function checks whether there is a user with the given email, and returns a boolean value accordingly.
const isUserInDBByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            return true;
        } else {
            return false; // User not found
        }
    } catch (error) {
        throw error;
    }
};

//This function returns the user with the given email and googleId.
//If there is no user that matches, it throws an error.
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

//This function sets tableContent to be the given content, for the given user and the given tableNum.
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
        // Saving the new table content instead.
        await Tables.updateTable(parseInt(tableNum), tableContent, email, googleId, userId)
    } catch (err) {
        throw err
    }
}

//This function returns the asked table of the user with the given credentials.
//It is returned in the format expected by the client.
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

//This function returns the asked table of the user with the given userId.
//It is returned in the format expected by the client.
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

