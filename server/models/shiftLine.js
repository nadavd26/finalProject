const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShiftLine = new Schema(
    {
        day: {
            type: String,
            required: true,
        },
        skill : {
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
        numOfWorkers : {
            type: Number,
            required: true,
        },
        cost : {
            type: Number,
            required: true,
        }
    },
    { autoIndex: false, autoCreate: false }
);

module.exports = mongoose.model("ShiftLine", ShiftLine);