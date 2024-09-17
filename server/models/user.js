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
        shiftTables: [{
            day: {
                type: String,
                required: true,
            },
            skill: {
                type: String,
                required: true,
            },
            shifts: [{
                type: Schema.Types.ObjectId,
                ref: "ShiftLine",
                required: true,
            }],
        }],
        assignedShiftTables: [{
            day: {
                type: String,
                required: true,
            },
            assignedShifts: [{
                type: Schema.Types.ObjectId,
                ref: "AssignedShiftLine",
                required: true,
            }],
        }],
        //Those bits are set after their tables are updated, and reset when the relevant algorithm was executed.
        table1Bit : {
            type: Boolean,
            default: false,
        },
        table2Bit : {
            type: Boolean,
            default: false,
        },
        table3Bit : {
            type: Boolean,
            default: false,
        },
        shiftTablesBit : {
            type: Boolean,
            default: false,
        },
        assignedShiftTablesBit : {
            type: Boolean,
            default: false,
        },
    },
    { autoIndex: false, autoCreate: false }
);

module.exports = mongoose.model("User", User);