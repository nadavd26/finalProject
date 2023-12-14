const UserService = require("../services/user");
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
            const token = jwt.sign(user, process.env.SECRET_KEY, {
                expiresIn: "20m",
            });
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
                const token = jwt.sign(user, process.env.SECRET_KEY, {
                    expiresIn: "20m",
                });
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
module.exports = { login, createUser }