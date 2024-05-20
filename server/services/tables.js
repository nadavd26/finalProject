const TableLine1 = require("../models/tableLine1");
const TableLine2 = require("../models/tableLine2");
const TableLine3 = require("../models/tableLine3");
const tableSorter = require("../services/tableSorting")
const tableValidator = require("../services/tableValidator")
const User = require("../models/user");
//The function gets a table number and tableLine id numbers and delete those tableLines.
const removeLinesByIds = async (tableNum, tableLineIDsToDelete) => {
    try {
        switch (tableNum) {
            case 1:
                await TableLine1.deleteMany({
                    _id: { $in: tableLineIDsToDelete }
                });
                break;
            case 2:
                await TableLine2.deleteMany({
                    _id: { $in: tableLineIDsToDelete }
                });
                break;
            case 3:
                await TableLine3.deleteMany({
                    _id: { $in: tableLineIDsToDelete }
                });
                break;
            default:
                console.log("Invalid table number.")
        }
    } catch (err) {
        throw err
    }
}
//This function updates the relvant table in the db for the relvant user.
const updateTable = async (tableNum, tableContent, email, googleId) => {
    try {
        const tableField = `table${tableNum}`;
        switch (tableNum) {
            case 1:
                const tableLines1 = [];
                for (const lineData of tableContent) {
                    const tableLine1 = new TableLine1({
                        id: lineData[0],
                        name: lineData[1],
                        skill1: lineData[2],
                        skill2: lineData[3],
                        skill3: lineData[4],
                        minHouers: lineData[5],
                        maxHouers: lineData[6],
                    });
                    const savedLine = await tableLine1.save();
                    tableLines1.push(savedLine._id);
                }
                await User.findOneAndUpdate(
                    { email, googleId },
                    { $addToSet: { [tableField]: { $each: tableLines1 } } }
                );
                break;
            case 2:
                const tableLines2 = [];
                // Creating TableLine objects and save them in the database
                for (const lineData of tableContent) {
                    const tableLine2 = new TableLine2({
                        day: lineData[0],
                        skill: lineData[1],
                        startTime: lineData[2],
                        finishTime: lineData[3],
                        requiredNumOfWorkers: lineData[4],
                    });
                    const savedLine = await tableLine2.save();
                    tableLines2.push(savedLine._id);
                }
                // Updating the user's table array with the created TableLine objects
                await User.findOneAndUpdate(
                    { email, googleId },
                    { $addToSet: { [tableField]: { $each: tableLines2 } } }
                );
                break;
            case 3:
                const tableLines3 = [];
                for (const lineData of tableContent) {
                    const tableLine3 = new TableLine3({
                        skill: lineData[0],
                        day: lineData[1],
                        startTime: lineData[2],
                        finishTime: lineData[3],
                        cost: lineData[4],
                    });
                    const savedLine = await tableLine3.save();
                    tableLines3.push(savedLine._id);
                }
                await User.findOneAndUpdate(
                    { email, googleId },
                    { $addToSet: { [tableField]: { $each: tableLines3 } } }
                );
                break;
            default:
                console.log("Invalid table number.")
        }
    } catch (err) {
        throw err
    }
}
//Getting rid of the id and v fields and converting from json to simple array.
const formatTable = (tableNum, tableContent) => {
    try {
        switch (tableNum) {
            case 1:
                return tableContent.map(line => [
                    line.id,
                    line.name,
                    line.skill1,
                    line.skill2,
                    line.skill3,
                    String(line.minHouers),
                    String(line.maxHouers),
                ]);
            case 2:
                return tableContent.map(line => [
                    line.day,
                    line.skill,
                    line.startTime,
                    line.finishTime,
                    line.requiredNumOfWorkers.toString(),
                ]);
            case 3:
                return tableContent.map(line => [
                    line.skill,
                    line.day,
                    line.startTime,
                    line.finishTime,
                    line.cost.toString(),
                ]);
            default:
                console.log("Invalid table number.")
        }
    } catch (err) {
        throw err
    }
}
//Sorting the table with the relevant sorting function.
const sortTable = (table, tableNum) => {
    switch (tableNum) {
        case 1:
            // Sorting each line's skills (which are the 3rd 4th and 5th items.).
            for (i = 0; i < table.length; i++) {
                table[i] = table[i].slice(0, 2).concat(table[i].slice(2, 5).sort(tableSorter.compareTable1Line)).concat(table[i].slice(5))
            }
            //Sorting the table itself.
            return table.sort(tableSorter.customSort1)
        case 2:
            return table.sort(tableSorter.customSort2)
        case 3:
            return table.sort(tableSorter.customSort3)
        default:
            console.log("Invalid table number.")
    }
}
//Validating the table with the relevant validation function.
const validateTable = (table, tableNum) => {
    switch (tableNum) {
        case 1:
            return tableValidator.validateTable1(table)
        case 2:
            return tableValidator.validateTable2(table)
        case 3:
            return tableValidator.validateTable3(table)
        default:
            console.log("Invalid table number.")
    }
}
module.exports = { removeLinesByIds, updateTable, formatTable, sortTable, validateTable }