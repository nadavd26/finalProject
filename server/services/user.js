const User = require("../models/user");

const createUser = async (email, familyName, givenName, googleId, imageUrl, name) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error("User has already signed in once.");
        const user = new User({
            email, familyName, givenName, googleId, imageUrl, name
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

const setTable = async (email, googleId, tableContent, tableNum) => {
    table = 'table' + tableNum
    await User.findOneAndUpdate({ email, googleId }, { $set: { [table]: tableContent } });
}

const getTable = async (email, googleId, tableNum) => {
    table = 'table' + tableNum
    const user = await User.findOne({ email, googleId });
    console.log(user.table3)
    if (tableNum == 1) {
        return user.table1
    }
    else if (tableNum == 2) {
        return user.table2
    }
    else if (tableNum == 3) {
        return user.table3
    }
    else {
        return ""
    }
}

module.exports = { createUser, isUserInDBByEmail, getUser, setTable, getTable }

