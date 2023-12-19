const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        familyName: {
            type: String,
            required: true,
        },
        givenName: {
            type: String,
            required: true,
        },
        googleId: {
            type: String,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        table1: {
            type: String,
            default: "",
        },
        table2: {
            type: String,
            default: "",
        },
        table3: {
            type: String,
            default: "",
        },
    },
    { autoIndex: false, autoCreate: false }
);

module.exports = mongoose.model("User", User);