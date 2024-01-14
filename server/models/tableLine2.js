const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TableLine2 = new Schema(
    {
        day: {
            type: String,
            required: true,
        },
        skill: {
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
        requiredNumOfWorkers : {
            type: Number,
            required: true,
        },
    },
    { autoIndex: false, autoCreate: false }
);

module.exports = mongoose.model("TableLine2", TableLine2);