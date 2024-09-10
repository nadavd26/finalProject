const jwt = require("jsonwebtoken");

const checkAuthorized = (req, res, next) => {
    if (req.headers.authorization) {
        const [_, token] = req.headers.authorization.split(" ");
        try {
            const user = jwt.verify(token, process.env.SECRET_KEY);
            req.token = token;
            req.user = user;
            return next();
        } catch (err) {
            
        }
    }
    return res.status(401).send("Unauthorized");
};
module.exports = checkAuthorized;