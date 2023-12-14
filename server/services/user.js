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

module.exports = { createUser, isUserInDBByEmail, getUser }

