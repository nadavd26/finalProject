const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

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
        }, 
        id2: {
            type: Number,
            unique: true,
        }
    },
    { autoIndex: false, autoCreate: false }
);
ShiftLine.plugin(autoIncrement, { inc_field: 'id2' });

module.exports = mongoose.model("ShiftLine", ShiftLine);