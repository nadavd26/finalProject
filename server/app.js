const express = require('express');
require("custom-env").env(process.env.NODE_ENV, "./config");
const mongoose = require("mongoose");
mongoose.connect(process.env.CONNECTION_STRING, {
});
const bodyParser = require("body-parser");
const checkAuthorized = require("./middlewares/authorization");
const app = express()
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json())
app.use("/Login", require("./routes/user.js"))
app.use("/Table1", checkAuthorized, require("./routes/table1.js"))
/*app.use("/Table2", checkAuthorized, require("./routes/table2.js"))
app.use("/Table3", checkAuthorized, require("./routes/table3.js"))*/

const server = app.listen(process.env.SERVER_PORT)