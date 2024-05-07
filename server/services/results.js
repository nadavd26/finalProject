const User = require("../models/user");
const { spawn } = require('child_process');
const fs = require('fs');
//const fs = require('fs').promises; // Using fs.promises for async file operations

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

module.exports = {getResults1}