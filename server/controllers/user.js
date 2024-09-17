const UserService = require("../services/user");
const jwt = require("jsonwebtoken");

//This function creates and saves the user in the DB based on the information of his google account.
//It also genrates a token for this user that will be used by him in future requests to prove it is actually him.
//This token is sent to him as a reply.
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
            const token = jwt.sign(user, process.env.SECRET_KEY);
            res.status(200).send(token);
        }
    } catch (err) {
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
};

//This function is used to allow the user to log in to his account.
//It is checked whether the user has already has an account or not.
//If he does than the function generates him a token and sends it to him.
//Otherwise it calls the createUser function described above.
const login = async (req, res) => {
    try {
        bool = await UserService.isUserInDBByEmail(req.body.email)
        if (bool) {   //Checking if the user is in the DB.
            //Creating token
            let user = await UserService.getUser(req.body.email, req.body.googleId)
            if (user != null) {
                user = user.toObject();
                const token = jwt.sign(user, process.env.SECRET_KEY);
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