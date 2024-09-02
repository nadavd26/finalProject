const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const Schema = mongoose.Schema;

const AssignedShiftLine = new Schema(
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
        assignedWorkerName : {
            type: String,
        },
        shiftId : {
            type: Number,
            required: true,
        },
        id: {
            type: Number,
            unique: true,
        }
    },
    { autoIndex: false, autoCreate: false }
);
AssignedShiftLine.plugin(autoIncrement, { inc_field: 'id' });

module.exports = mongoose.model("AssignedShiftLine", AssignedShiftLine);