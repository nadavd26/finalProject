const jwt = require("jsonwebtoken");

const checkAuthorized = (req, res, next) => {
    if (req.headers.authorization) {
        const [_, token] = req.headers.authorization.split(" ");
        try {
            const user = jwt.verify(token, process.env.SECRET_KEY);
            req.token = token;
            req.user = user;
            // console.log(req.user.username, req.user._id);
            return next();
        } catch (err) {
            console.log(err.message);
        }
    }
    return res.status(401).send("Unauthorized");
};
module.exports = checkAuthorized;