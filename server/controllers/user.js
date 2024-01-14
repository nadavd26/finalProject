const UserService = require("../services/user");
const TablesService = require("../services/tables")
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
            const token = jwt.sign(user, process.env.SECRET_KEY);
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

const setTable = async (req, res) => {
    try {
        content = JSON.parse(req.body.content)
        /*if (!tableValidator.validateTable2(content))
            res.status(404).send("Invalid table.")*/
        if (!TablesService.validateTable(content, parseInt(req.params.tableNum)))
            res.status(404).send("Invalid table.")
        else {
            console.log(content)
            if (req.params.tableNum != 1 && req.params.tableNum != 2 && req.params.tableNum != 3) {
                res.status(404).send("Invalid table number.")
            } else {
                await UserService.setTable(req.user.email, req.user.googleId, content, req.params.tableNum)
                res.sendStatus(200)
            }
        }
    } catch (err) {
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
}

const getTable = async (req, res) => {
    try {
        if (req.params.tableNum != 1 && req.params.tableNum != 2 && req.params.tableNum != 3) {
            res.status(404).send("Invalid table number.")
            return
        }
        tableContent = await UserService.getTable(req.user.email, req.user.googleId, req.params.tableNum)
        if (JSON.stringify(tableContent) != JSON.stringify([]))
            res.status(200).send(tableContent);
        else
            res.status(404).send("Invalid table number or table number that was never set.")
    } catch (err) {
        if (err.name === "Error") {
            res.sendStatus(409);
        }
    }
}

const sortTable = (req, res) => {
    table = JSON.parse(req.body.content)
    //const sortedTable = table.sort(tableSorter.customSort2)
    const sortedTable = TablesService.sortTable(table, parseInt(req.params.tableNum))
    res.status(200).send({ content: sortedTable })
}
module.exports = { login, createUser, setTable, getTable, sortTable }