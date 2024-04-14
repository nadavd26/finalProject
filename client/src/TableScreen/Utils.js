async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateShiftArray(shifts) {
    const shiftArray = new Array(48).fill(false);

    shifts.forEach(shift => {
        const startTime = shift.start.split(':').map(Number);
        const endTime = shift.end.split(':').map(Number);

        const startIndex = (startTime[0] * 2) + (startTime[1] / 30);
        const endIndex = (endTime[0] * 2) + (endTime[1] / 30);

        for (let i = startIndex; i < endIndex; i++) {
            shiftArray[Math.floor(i)] = true;
        }
    });

    return shiftArray;
}


function generateShifts(scheduleData, workerTable) {
    const workersAndShifts = [];
    const existingWorkers = workerTable.map(entry => entry[1] + "\n" + entry[0]);
    const scheduleWorkerIDs = scheduleData.map(entry => entry[4]);
    const newWorkers = existingWorkers.filter(workerID => !scheduleWorkerIDs.includes(workerID));
    newWorkers.forEach(worker => {
        const shifts = new Array(48).fill(false);
        workersAndShifts.push({ name: worker, shifts });
    });
    const filteredData = scheduleData.filter(entry => entry[4].trim() !== '');
    const groupedData = filteredData.reduce((acc, [day, skill, start, end, workerID]) => {
        if (!acc[workerID]) {
            acc[workerID] = [];
        }
        acc[workerID].push({ day, start, end });
        return acc;
    }, {});
    for (const workerID in groupedData) {
        const shifts = new Array(48).fill(false); // Initialize with false for each half-hour slot
        groupedData[workerID].forEach(({ start, end }) => {
            const startIndex = (parseInt(start.split(':')[0]) - 7) * 2;
            const endIndex = (parseInt(end.split(':')[0]) - 7) * 2 + (end.endsWith(':30') ? 1 : 0);
            for (let i = startIndex; i < endIndex; i++) {
                shifts[i] = true; // Set true for each half-hour slot the worker is scheduled
            }
        });
        workersAndShifts.push({ name: workerID, shifts });
    }
    return workersAndShifts;
}

export function generateWorkerMap(table) {
    const workerMap = new Map();

    for (let i = 0; i < table.length; i++) {
        const row = table[i];
        const id = row[0]; 
        const name = row[1];
        const skill1 = row[2];
        const skill2 = row[3];
        const skill3 = row[4];

        // Add skill1
        if (skill1 && skill1 != "") {
            if (!workerMap.has(skill1)) {
                workerMap.set(skill1, []);
            }
            workerMap.get(skill1).push({ id, name });
        }

        // Add skill2
        if (skill2 && skill2 != "") {
            if (!workerMap.has(skill2)) {
                workerMap.set(skill2, []);
            }
            workerMap.get(skill2).push({ id, name });
        }

        // Add skill3
        if (skill3 && skill3 != "") {
            if (!workerMap.has(skill3)) {
                workerMap.set(skill3, []);
            }
            workerMap.get(skill3).push({ id, name });
        }
    }

    // console.log("worker map : " + mapToString(workerMap))
    return workerMap;
}
function mapToString(map) {
    let str = '';
    map.forEach((value, key) => {
        str += `${key}: ${JSON.stringify(value)}\n`; // Assuming key and value are strings
    });
    return str;
}

export function generateShiftList(table) {
    // console.log("Input table:");
    // console.log(table);

    const shifts = {};
    let currentShiftId = null;
    let currentShiftStartIndex = null;

    for (let i = 0; i < table.length; i++) {
        const row = table[i];
        const skill = row[0];
        const day = row[1];
        const from = row[2];
        const until = row[3];
        const shiftId = row[5];

        // If a new shift starts
        if (shiftId !== currentShiftId) {
            // If there was a previous shift, update its end index
            if (currentShiftId !== null) {
                shifts[currentShiftId].end = i - 1;
            }

            // Start a new shift
            currentShiftId = shiftId;
            currentShiftStartIndex = i;

            // Initialize the shift object
            shifts[currentShiftId] = { start: currentShiftStartIndex, end: null, overlaps: [] };
        }

        // Update the end index of the current shift
        shifts[currentShiftId].end = i;

        // Check for overlaps with previous shifts
        for (const otherShiftId in shifts) {
            if (otherShiftId !== currentShiftId) {
                const otherShift = shifts[otherShiftId];
                // Check if shifts are overlapping
                if (from < table[otherShift.end][3] && until > table[otherShift.start][2]) {
                    // There is an overlap
                    const overlapId = parseInt(otherShiftId); // Convert otherShiftId to integer
                    // Check if the overlap is not already recorded
                    if (!shifts[currentShiftId].overlaps.includes(overlapId)) {
                        shifts[currentShiftId].overlaps.push(overlapId);
                    }
                    // Check if the other shift does not already record the current shift as an overlap
                    if (!otherShift.overlaps.includes(currentShiftId)) {
                        otherShift.overlaps.push(parseInt(currentShiftId)); // Convert currentShiftId to integer
                    }
                }
            }
        }
    }

    // Update the end index of the last shift
    if (currentShiftId !== null) {
        shifts[currentShiftId].end = table.length - 1;
    }

    // console.log("Shift list:");
    // console.log(shifts);

    return shifts;
}




export async function generateAlgo2Results(table) {
    const scheduleData = duplicateLines(table)
    // console.log("scheduleData : " + scheduleData)
    const scheduleDataSunday = scheduleData.filter(item => item[0].toLowerCase() === "sunday");
    const scheduleDataMonday = scheduleData.filter(item => item[0].toLowerCase() === "monday");
    const scheduleDataTuesday = scheduleData.filter(item => item[0].toLowerCase() === "tuesday");
    const scheduleDataWednesday = scheduleData.filter(item => item[0].toLowerCase() === "wednesday");
    const scheduleDataThursday = scheduleData.filter(item => item[0].toLowerCase() === "thursday");
    const scheduleDataFriday = scheduleData.filter(item => item[0].toLowerCase() === "friday");
    const scheduleDataSaturday = scheduleData.filter(item => item[0].toLowerCase() === "saturday");


    const data = {
        Sunday: scheduleDataSunday,
        Monday: scheduleDataMonday,
        Tuesday: scheduleDataTuesday,
        Wednesday: scheduleDataWednesday,
        Thursday: scheduleDataThursday,
        Friday: scheduleDataFriday,
        Saturday: scheduleDataSaturday
    }

    // console.log("data : " + JSON.stringify(data))

    return data

}

export function generateAlgoShifts(data) {
    const shifts = {
        Sunday: generateShiftList(data.Sunday),
        Monday: generateShiftList(data.Monday),
        Tuesday: generateShiftList(data.Tuesday),
        Wednesday: generateShiftList(data.Wednesday),
        Thursday: generateShiftList(data.Thursday),
        Friday: generateShiftList(data.Friday),
        Saturday: generateShiftList(data.Saturday)
    }

    return shifts
}

export function generateAlgoGraphicResults(data, workerTable) {
    const daysWorkersAndShifts = {
        Sunday: generateShifts(data.Sunday, workerTable),
        Monday: generateShifts(data.Monday, workerTable),
        Tuesday: generateShifts(data.Tuesday, workerTable),
        Wednesday: generateShifts(data.Wednesday, workerTable),
        Thursday: generateShifts(data.Thursday, workerTable),
        Friday: generateShifts(data.Friday, workerTable),
        Saturday: generateShifts(data.Saturday, workerTable)
    }

    return daysWorkersAndShifts
}

function transformDataToMap(data) {
    const resultMap = new Map();

    data.forEach(entry => {
        const key = getKey(entry[1], entry[0]); // Combining day and skill to form the key
        if (!resultMap.has(key)) {
            resultMap.set(key, []);
        }
        resultMap.get(key).push([entry[1], entry[0], entry[2], entry[3], entry[4]]);
    });

    return resultMap;
}

function duplicateLines(table) {
    const duplicatedData = [];
    var shiftsId = 0 
    table.forEach((value, key) => {
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < value[i][4]; j++) {
                duplicatedData.push([value[i][0], value[i][1], value[i][2], value[i][3], "", shiftsId]);
            }

            shiftsId++
        }

    });
    // console.log("dupliacte lines111 " + duplicatedData)
    return duplicatedData;
}



export async function generateAlgo1Results(table) {
    const scheduleData = table
    for (let i = 0; i < scheduleData.length; i++) {
        scheduleData[i][4] = (2*i+5) % 10
    }

    const transformedData = transformDataToMap(scheduleData);
    // console.log("hiiiiii" + transformedData["TV technition"]["sunday"]);
    await sleep(2000);
    return transformedData
}

export function getKey(day, skill) {
    return (day).toLowerCase() + "*" + skill
}

export function getSkillSet(arr) {
    const uniqueValues = new Set();
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i][1];
        uniqueValues.add(element);
    }

    return Array.from(uniqueValues);
}

export function removeElementAtIndex(arr, index) {
    if (index < 0 || index >= arr.length) {
        throw new Error('Index is out of bounds');
    }

    const newArray = arr.slice(0, index);

    return newArray.concat(arr.slice(index + 1));
}

export function removeElementFromArray(arr, element) {
    return arr.filter(item => item !== element);
}
