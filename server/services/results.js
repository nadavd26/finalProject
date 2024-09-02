const User = require("../models/user");
const ShiftLine = require("../models/shiftLine")
const AssignedShiftLine = require("../models/assignedShiftLine")
const { spawn } = require('child_process');
const fs = require('fs');
const Table = require("../services/tables");
const { getTableByUserId } = require("./user");
const { sortResults1Map } = require("./tableSorting");
const TableValidator = require("../services/tableValidator")
//const fs = require('fs').promises; // Using fs.promises for async file operations

//This function runs algorithm 1 and returns the results.
const getResults1 = async (reqs, shifts, userId) => {
    console.log("Generating results1;")
    const shiftsJson = JSON.stringify(shifts);
    const reqsJson = JSON.stringify(reqs);
    const shiftsFileName = `./algorithm/shifts${userId}.json`;
    const reqsFileName = `./algorithm/reqs${userId}.json`;

    try {
        // Write JSON data to temporary files
        await fs.promises.writeFile(shiftsFileName, shiftsJson);
        await fs.promises.writeFile(reqsFileName, reqsJson);

        // Spawn a Python process
        const algorithm1 = spawn('python3', ['./algorithm/algorithm1.py']);

        let outputBuffer = '';

        // Handle stdout
        algorithm1.stdout.on('data', (data) => {
            outputBuffer += data; // Accumulate received data
        });

        // Handle stderr if needed
        algorithm1.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        // Create a promise to resolve when the subprocess finishes
        const subprocessFinished = new Promise((resolve, reject) => {
            // Handle process exit
            algorithm1.on('close', (code) => {
                // Delete JSON files after use
                /*fs.unlink(shiftsFileName);
                fs.unlink(reqsFileName);*/
                try {
                    const outputArray = JSON.parse(outputBuffer); // Parse accumulated data
                    resolve(outputArray); // Resolve the promise with the output
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    reject(error); // Reject the promise if parsing fails
                }
            });
        });

        // Pipe shifts JSON to the Python process
        const reqsStream = fs.createReadStream(reqsFileName);
        reqsStream.pipe(algorithm1.stdin, { end: false }); // Don't end the stream yet

        // Add a separator between JSON objects
        reqsStream.on('end', () => {
            algorithm1.stdin.write('\n'); // Add a newline character as a separator
            // Now pipe the shifts JSON
            fs.createReadStream(shiftsFileName).pipe(algorithm1.stdin);
        });

        // Await the subprocess to finish
        return subprocessFinished;

    } catch (error) {
        // Print error if any occurs
        console.error('Error in getResults1:', error);
        throw error;
    }
}

//This function runs algorithm 1 and returns the results.
const getResults2 = async (userId) => {
    console.log("Getting results2;")

    // Creating an empty map with all the days as keys.
    let results2Map = {
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
    };
    let id = 0; //Creating id that will be uniqe for each value.
    const inputMap = await getResults1FromDB(userId)
    // Populating the newMap with values from the inputMap
    for (let [key, value] of inputMap) {
        let dayOfWeek = key.split('*')[0]; //Getting the day, which is supposed to be before the '*'.
        // Capitalize the first letter of the day of the week
        let capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1); //Changin the first letter to be a capital letter.
        if (results2Map.hasOwnProperty(capitalizedDayOfWeek)) { //Checking if that value is really on of the days.
            value.forEach(entry => {
                for (let i = 0; i < entry[4]; i++) {
                    let transformedEntry = [
                        entry[0], // Keeping the first item as is
                        entry[1], // Keeping the second item as is
                        entry[2], // Keeping the third item as is
                        entry[3], // Keeping the fourth item as is
                        "",       // Setting the fifth item to be an empty string (for now)
                        id        // Giving this line a uniqe id.
                    ];
                    results2Map[capitalizedDayOfWeek].push(transformedEntry); //Adding this to the map.
                }
                if (entry[4] != 0)
                    id++; // Increment the unique ID for the next entry
            });
        }
    }

    return results2Map;
}

//This function deletes every all the shift tables and lines of the user. 
const deleteCurrentResults = async (userId) => {
    console.log("Deleting results1;")
    const user = await User.findById(userId)
    // Going through each shift table.
    for (const shiftTable of user.shiftTables) {
        //Inside each shift table, going through each shift line, in order to delete it.
        for (const shiftId of shiftTable.shifts) {
            await ShiftLine.findByIdAndDelete(shiftId);
        }
    }
    //Making the shift table empty and saving it.
    user.shiftTables = []
    await user.save()
}

//This function deletes all the assigned shift tables and lines of the user. 
const deleteCurrentResults2 = async (userId) => {
    console.log("Deleting results2;")
    const user = await User.findById(userId)
    // Going through each assigned shift table.
    for (const assignedShiftTable of user.assignedShiftTables) {
        //Inside each assigned shift table, going through each assigned shift line, in order to delete it.
        for (const assignedShiftId of assignedShiftTable.assignedShifts) {
            await AssignedShiftLine.findByIdAndDelete(assignedShiftId);
        }
    }
    //Making the assigned shift table empty and saving it.
    user.assignedShiftTables = []
    await user.save()
}

//This funciton gets the results and saves them in the database.
const saveResults = async (results, userId) => {
    console.log("Saving results1;")
    sortedResults = Table.sortTable(results, 2) //Same sorting as for table2.
    await deleteCurrentResults(userId)
    const user = await User.findById(userId)
    const table3 = await getTableByUserId(userId, 3)
    for (line of sortedResults) {
        //Creating the shiftLine
        const shiftLine = new ShiftLine({
            day: line[0],
            skill: line[1],
            startTime: line[2],
            finishTime: line[3],
            numOfWorkers: line[4],
            cost: getShiftCost(line[1], line[0], line[2], line[3], table3.table3Content)
        });
        const savedLine = await shiftLine.save();
        //Checking whether there already is a table of this pair of day and skill.
        //The item in index 0 is a day and in 1 it is skill.
        const existingShiftTable = user.shiftTables.find(table => table.day === line[0] && table.skill === line[1]);
        if (existingShiftTable) {
            //Adding this line to the existing table.
            existingShiftTable.shifts.push(savedLine._id);
        } else {
            // Creating a new shift table for the pair of day and skill
            user.shiftTables.push({
                day: line[0],
                skill: line[1],
                shifts: [savedLine._id]
            });
        }
        await user.save()
    }
    // Populating the shift lines for each shift table
    await user.populate('shiftTables.shifts');
    await TableValidator.setTableBit(userId, 4, true) //Setting the relevant bit to indicate that the results changed.
    await TableValidator.setTableBit(userId, 2, false) //Resetting the bits to indicate that those tables are relevant to the current results.
    await TableValidator.setTableBit(userId, 3, false)
    return await transformShiftTablesToMap(user.shiftTables);
}

//This funciton gets the results of algorithm2 and saves them in the database.
const saveResults2 = async (results, userId) => {
    console.log("Saving results2;")
    await deleteCurrentResults2(userId)
    const user = await User.findById(userId)
    const assignedShiftLines = [];
    for (let day in results) {
        for (let entry of results[day]) {
            let newAssignedShiftLine = new AssignedShiftLine({
                day: entry[0],
                skill: entry[1],
                startTime: entry[2],
                finishTime: entry[3],
                assignedWorkerName: entry[4],
                shiftId: entry[5]
            });
            const savedLine = await newAssignedShiftLine.save();
            const existingAssignedShiftTable = user.assignedShiftTables.find(table => table.day === day);
            if (existingAssignedShiftTable) {
                //Adding this line to the existing table.
                existingAssignedShiftTable.assignedShifts.push(savedLine._id);
            } else {
                // Creating a new shift table for the pair of day and skill
                user.assignedShiftTables.push({
                    day: day,
                    assignedShifts: [savedLine._id]
                });
            }
        }
        await user.save();
        await TableValidator.setTableBit(userId, 1, false) //Resetting the bits to indicate that those tables are relevant to the current results.
        await TableValidator.setTableBit(userId, 4, false)
    }
}

const getResults1FromDB = async (userId) => {
    console.log("Getting results1 from DB;")
    const user = await User.findById(userId)
    await user.populate('shiftTables.shifts');
    return await transformShiftTablesToMap(user.shiftTables);
}
const getResults2FromDB = async (userId) => {
    console.log("Getting results2 from DB;")
    const user = await User.findById(userId)
    await user.populate('assignedShiftTables.assignedShifts');
    return await transformAssignedShiftTablesToMap(user.assignedShiftTables);
}

// This function transforms the user's shiftTables data into a map
const transformShiftTablesToMap = async (shiftTables) => {
    const resultMap = new Map();
    // Iterate over each shift table in the user's data
    shiftTables.forEach(shiftTable => {
        const key = getKey(shiftTable.day, shiftTable.skill); // Form the key using day and skill
        if (!resultMap.has(key)) {
            resultMap.set(key, []); // Initialize an empty array for the key if it doesn't exist
        }
        // Push the shifts data into the array for the corresponding key
        const shiftsData = shiftTable.shifts.map(shift => ([
            shiftTable.day,
            shiftTable.skill,
            shift.startTime,
            shift.finishTime,
            shift.numOfWorkers,
            shift.cost
        ]));
        resultMap.get(key).push(...shiftsData);
    });
    return sortResults1Map(resultMap);
}

// This function transforms the user's shiftTables data into a map
const transformAssignedShiftTablesToMap = async (assignedShiftTables) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const resultMap = new Map();
    daysOfWeek.forEach(day => {
        resultMap.set(day, []);
    });
    // Iterate over each assgined shift table in the user's data
    assignedShiftTables.forEach(assignedShiftTable => {
        const key = assignedShiftTable.day
        if (!resultMap.has(key)) {
            resultMap.set(key, []); // Initialize an empty array for the key if it doesn't exist
        }
        // Push the assigned shifts data into the array for the corresponding key
        const assignedShiftsData = assignedShiftTable.assignedShifts.map(assignedShift => ([
            assignedShift.day,
            assignedShift.skill,
            assignedShift.startTime,
            assignedShift.finishTime,
            assignedShift.assignedWorkerName,
            assignedShift.shiftId,
            assignedShift.id
        ]));
        resultMap.get(key).push(...assignedShiftsData);
    });
    return resultMap;
}

function getKey(day, skill, req) {
    if (!req) {
        return (day).toLowerCase() + "*" + skill
    }

    return skill + "" + (day).toLowerCase()
}

//Calculating the cost of the shift according to table 3. 
//Assuming there is only one that share the same day, skill, startTime and finishTime.
/*function getShiftCost(shift, table3) {
    for (line of table3) {
        if (line[0] == shift.skill && line[1] == shift.day && line[2] == shift.startTime && line[3] == shift.finishTime)
            return shift.numOfWorkers * line[4]
    }
}*/
//Getting the cost of a single shift according to table3.
function getShiftCost(skill, day, startTime, finishTime, table3) {
    for (line3 of table3) {
        if (line3[0] == skill && line3[1] == day && line3[2] == startTime && line3[3] == finishTime)
            return line3[4]
    }
}

//This function updates the results. It assumes that they all lines share the same day and skill.
const editResults = async (newData, userId) => {
    console.log("Editting results1;")
    const keyDay = newData[0][0]
    const keySkill = newData[0][1]
    const user = await User.findById(userId)
    // Finding the index of the shift table with the given day and skill
    const shiftTableIndex = user.shiftTables.findIndex(table => table.day === keyDay && table.skill === keySkill);
    //Checking if such a table exists. If it is, it will be deleted and replaced with the new data.
    if (shiftTableIndex !== -1) {
        // Gping through every shift in this shift table in order to delete those shifts.
        const shiftTable = user.shiftTables[shiftTableIndex];
        for (const shiftId of shiftTable.shifts) {
            await ShiftLine.findByIdAndDelete(shiftId);
        }
        // Removing the shifth table itself.
        user.shiftTables.splice(shiftTableIndex, 1);
        await user.save();
    }
    //Now saving the new shifts.
    for (line of newData) {
        //Creating the shiftLine
        const shiftLine = new ShiftLine({
            day: line[0],
            skill: line[1],
            startTime: line[2],
            finishTime: line[3],
            numOfWorkers: line[4],
            cost: line[5]
        });
        const savedLine = await shiftLine.save();
        //Checking whether there already is a table of this pair of day and skill.
        //The item in index 0 is a day and in 1 it is skill.
        const existingShiftTable = user.shiftTables.find(table => table.day === line[0] && table.skill === line[1]);
        if (existingShiftTable) {
            //Adding this line to the existing table.
            existingShiftTable.shifts.push(savedLine._id);
        } else {
            // Creating a new shift table for the pair of day and skill
            user.shiftTables.push({
                day: keyDay,
                skill: keySkill,
                shifts: [savedLine._id]
            });
        }
        await user.save()
        await TableValidator.setTableBit(userId, 4, true) //Setting the relevant bit to indicate that the results changed.
        //await TableValidator.setTableBit(userId, 2, false) //Resetting the bits to indicate that those tables are relevant to the current results.
        //await TableValidator.setTableBit(userId, 3, false)
    }
}

//This function updates the alog2 results of a given day.
const editResults2OfDay = async (newData, day, userId) => {
    const user = await User.findById(userId)
    // Finding the index of the assigned shift table with the given day.
    const assignedShiftTableIndex = user.assignedShiftTables.findIndex(table => table.day === day);
    //Checking if such a table exists. If it is, it will be deleted and replaced with the new data.
    if (assignedShiftTableIndex !== -1) {
        // Going through every assigned shifts in this assigned shifts table in order to delete those assigned shifts.
        const assignedShiftTables = user.assignedShiftTables[assignedShiftTableIndex];
        for (const assignedShiftId of assignedShiftTables.assignedShifts) {
            await AssignedShiftLine.findByIdAndDelete(assignedShiftId);
        }
        // Removing the assigned shifts table itself.
        user.assignedShiftTables.splice(assignedShiftTableIndex, 1);
        await user.save();
    }
    //Now saving the new assigned shifts.
    for (line of newData) {
        //Creating the assignedShiftLine
        const assignedShiftLine = new AssignedShiftLine({
            day: line[0],
            skill: line[1],
            startTime: line[2],
            finishTime: line[3],
            assignedWorkerName: line[4],
            shiftId: line[5]
        });
        const savedLine = await assignedShiftLine.save();
        //Checking whether there already is a table of day.
        const existingAssignedShiftTable = user.assignedShiftTables.find(table => table.day === day);
        if (existingAssignedShiftTable) {
            //Adding this line to the existing table.
            existingAssignedShiftTable.assignedShifts.push(savedLine._id);
        } else {
            // Creating a new shift table for the pair of day and skill
            user.assignedShiftTables.push({
                day: day,
                assignedShifts: [savedLine._id]
            });
        }
        await user.save()
    }
}
const editResults2 = async (req, userId) => {
    const editInfo = req.body
    console.log(editInfo)
    for (const [assignedShiftLineId, workerId] of Object.entries(editInfo)) {
        const assignedShiftLine = await AssignedShiftLine.findOne({ id: assignedShiftLineId })
        if (workerId === '') { //When its empty it means that the assigned worker needs to be deleted.
            assignedShiftLine.assignedWorkerName = '';
        } else { //Otherwise we assign the the worker with the given ID.
            const workerName = await getWorkerNameByWorkerId(userId, workerId)
            if (workerName === '') {
                throw new Error("There was no worker with the following ID: " + workerId)
            }
            assignedShiftLine.assignedWorkerName = workerName + '\n' + workerId;
        }
        await assignedShiftLine.save()
    }
    /*console.log("Editting results2;")
    await editResults2OfDay(req.body.Sunday, "Sunday", userId)
    await editResults2OfDay(req.body.Monday, "Monday", userId)
    await editResults2OfDay(req.body.Tuesday, "Tuesday", userId)
    await editResults2OfDay(req.body.Wednesday, "Wednesday", userId)
    await editResults2OfDay(req.body.Thursday, "Thursday", userId)
    await editResults2OfDay(req.body.Friday, "Friday", userId)
    await editResults2OfDay(req.body.Saturday, "Saturday", userId)*/
    //await TableValidator.setTableBit(userId, 1, false) //Resetting the bits to indicate that those tables are relevant to the current results.
    //await TableValidator.setTableBit(userId, 4, false)
}

//This functino returns the worker with the given ID. If there is no worker with that ID, it returns an empty string.
const getWorkerNameByWorkerId = async (userId, workerId) => {
    const table1 = await getTableByUserId(userId, 1)
    for (const line of table1.table1Content) {
        if (line[0] === workerId) {
            return line[1]
        }
    }
    return ''
}


module.exports = { getResults1, saveResults, editResults, getResults1FromDB, editResults2, getResults2FromDB, getResults2, saveResults2 }