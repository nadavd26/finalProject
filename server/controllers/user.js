const UserService = require("../services/user");

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
        res.sendStatus(200);
    } catch (err) {
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
};

const login = async (req, res) => {
    try {
        console.log(req.body.email);
        bool = await UserService.isUserInDBByEmail(req.body.email)
        console.log(2)
        if (bool) {   //Checking if the user is in the DB.
            res.sendStatus(200);
        }
        else { //Need to add him to the DB.
            console.log(12);
            await createUser(req, res);
        }
    } catch (err) {
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
}
module.exports = { login , createUser}