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
    console.log('In login')
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

module.exports = {createUser, isUserInDBByEmail}

