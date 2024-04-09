const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TableLine1 = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
        name : {
            type: String,
            required: true,
        },
        skill1: {
            type: String,
            required: true,
        },
        skill2: {
            type: String,
            required: true,
        },
        skill3: {
            type: String,
            required: true,
        },
        contract: {
            type: String,
            required: true,
        },
    },
    { autoIndex: false, autoCreate: false }
);

module.exports = mongoose.model("TableLine1", TableLine1);