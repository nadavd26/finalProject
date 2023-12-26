const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TableLine = new Schema(
    {
        day: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        finishTime: {
            type: String,
            required: true,
        },
        cost: {
            type: Number,
            required: true,
        },
    },
    { autoIndex: false, autoCreate: false }
);

module.exports = mongoose.model("TableLine", TableLine);