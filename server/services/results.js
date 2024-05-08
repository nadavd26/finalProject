const User = require("../models/user");
const ShiftLine = require("../models/shiftLine")
const { spawn } = require('child_process');
const fs = require('fs');
const shiftLine = require("../models/shiftLine");
const Table = require("../services/tables")
//const fs = require('fs').promises; // Using fs.promises for async file operations

//This function runs algorithm 1 and returns the results.
const getResults1 = async (reqs, shifts, userId) => {
    const shiftsJson = JSON.stringify(shifts);
    const reqsJson = JSON.stringify(reqs);
    console.log(shiftsJson)
    console.log(reqsJson)
    const shiftsFileName = `./algorithm/shifts${userId}.json`;
    const reqsFileName = `./algorithm/reqs${userId}.json`;

    try {
        // Write JSON data to temporary files
        await fs.promises.writeFile(shiftsFileName, shiftsJson);
        await fs.promises.writeFile(reqsFileName, reqsJson);

        console.log("JSON files are written successfully.");

        // Spawn a Python process
        const algorithm1 = spawn('python', ['./algorithm/algorithm1.py']);

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
                    console.log(outputArray);
                    console.log("HERE")
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
        console.error('Error in getResults1:', error);
        throw error;
    }
}

const deleteCurrentResults = async (userId) => {
    const user = await User.findById(userId)
    user.shiftTables = []
    await user.save()
}

//This funciton gets the results and saves them in the database.
const saveResults = async (results, userId) => {
    sortedResults = Table.sortTable(results, 2) //Same sorting as for table2.
    await deleteCurrentResults(userId)
    const user = await User.findById(userId)
    for(line of sortedResults) {
        //Creating the shiftLine
        const shiftLine = new ShiftLine({
            day: line[0],
            skill: line[1],
            startTime: line[2],
            finishTime: line[3],
            numOfWorkers: line[4],
        });
        const savedLine = await shiftLine.save();
        //Checking whether there already is a table of this pair of day and skill.
        //The item in index 0 is a day and in 1 it is skill.
        const existingShiftTable = user.shiftTables.find(table => table.day === line[0] && table.skill === line[1]);
        if(existingShiftTable) {
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
    return transformShiftTablesToMap(user.shiftTables)
}
// This function transforms the user's shiftTables data into a map
function transformShiftTablesToMap(shiftTables) {
    const resultMap = new Map();

    // Iterate over each shift table in the user's data
    shiftTables.forEach(shiftTable => {
        const key = getKey(shiftTable.day, shiftTable.skill); // Form the key using day and skill
        if (!resultMap.has(key)) {
            resultMap.set(key, []); // Initialize an empty array for the key if it doesn't exist
        }
        // Push the shifts data into the array for the corresponding key
        const shiftsData = shiftTable.shifts.map(shift => ({
            day: shiftTable.day,
            skill: shiftTable.skill,
            startTime: shift.startTime,
            finishTime: shift.finishTime,
            numOfWorkers: shift.numOfWorkers
        }));
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


module.exports = {getResults1, saveResults}