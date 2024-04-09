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
        table1: [{
            type: Schema.Types.ObjectId,
            ref: "TableLine1",
            required: true,
        }],
        table2: [{
            type: Schema.Types.ObjectId,
            ref: "TableLine2",
            required: true,
        }],
        table3: [{
            type: Schema.Types.ObjectId,
            ref: "TableLine3",
            required: true,
        }],
    },
    { autoIndex: false, autoCreate: false }
);

module.exports = mongoose.model("User", User);