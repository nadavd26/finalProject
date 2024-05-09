const User = require("../models/user");
const ShiftLine = require("../models/shiftLine")
const { spawn } = require('child_process');
const fs = require('fs');
const Table = require("../services/tables");
const { getTableByUserId } = require("./user");
//const fs = require('fs').promises; // Using fs.promises for async file operations

//This function runs algorithm 1 and returns the results.
const getResults1 = async (reqs, shifts, userId) => {
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

//This function deletes every all the shift tables and lines of the user. 
const deleteCurrentResults = async (userId) => {
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

//This funciton gets the results and saves them in the database.
const saveResults = async (results, userId) => {
    sortedResults = Table.sortTable(results, 2) //Same sorting as for table2.
    await deleteCurrentResults(userId)
    const user = await User.findById(userId)
    const table3 = await getTableByUserId(userId,3)
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
    return await transformShiftTablesToMap(user.shiftTables, userId);
}

// This function transforms the user's shiftTables data into a map
const transformShiftTablesToMap = async (shiftTables, userId) => {
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
            return line[4]
    }
}

//This function updates the results. It assumes that they all lines share the same day and skill.
const editResults = async (newData, userId) => {
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
    }
}


module.exports = { getResults1, saveResults, editResults }
