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


function generateShifts(scheduleData, workerTable, existingWorkers) {
    // console.log("scheduleData")
    // console.log(scheduleData)
    const workersAndShifts = [];
    const timeIndexMap = {
        "07:00": 0, "07:30": 1, "08:00": 2, "08:30": 3, "09:00": 4, "09:30": 5,
        "10:00": 6, "10:30": 7, "11:00": 8, "11:30": 9, "12:00": 10, "12:30": 11,
        "13:00": 12, "13:30": 13, "14:00": 14, "14:30": 15, "15:00": 16, "15:30": 17,
        "16:00": 18, "16:30": 19, "17:00": 20, "17:30": 21, "18:00": 22, "18:30": 23,
        "19:00": 24, "19:30": 25, "20:00": 26, "20:30": 27, "21:00": 28, "21:30": 29,
        "22:00": 30, "22:30": 31, "23:00": 32, "23:30": 33, "00:00": 34, "00:30": 35,
        "01:00": 36, "01:30": 37, "02:00": 38, "02:30": 39, "03:00": 40, "03:30": 41,
        "04:00": 42, "04:30": 43, "05:00": 44, "05:30": 45, "06:00": 46, "06:30": 47
    };

    // Extract existing workers from the worker table


    // Extract worker IDs from the schedule data
    const scheduleWorkerIDs = scheduleData.map(entry => entry[4]);

    // Filter out new workers who are not in the existing workers list
    const newWorkers = existingWorkers.filter(workerID => !scheduleWorkerIDs.includes(workerID));

    // Initialize shifts for new workers
    const shiftsFalse = new Array(48).fill(false);
    newWorkers.forEach(worker => {
        workersAndShifts.push({ name: worker, shifts: shiftsFalse });
    });

    // Initialize a map to store unique shifts for each worker
    const workerShiftsMap = new Map();

    // Process each entry in the schedule data
    scheduleData.forEach(([day, skill, start, end, workerID, shiftId]) => {
        if (workerID == "") {
            return
        }
        // Adjust start and end times to half-hour slots
        const startIndex = timeIndexMap[start]
        var endIndex = timeIndexMap[end] - 1
        if (endIndex == -1) { //timeIndexMap[end] == 07:00, we need to go back to 06:30
            endIndex = 47
        }
        let shifts = workerShiftsMap.get(workerID);
        if (!shifts) {
            shifts = new Array(48).fill(false);
            workerShiftsMap.set(workerID, shifts);
        }
        if (endIndex > startIndex) {
            for (let i = startIndex; i <= endIndex; i++) {
                shifts[i] = true;
            }

        }

        if (startIndex > endIndex) { //00:00 to 23:00 for example
            for (let i = startIndex; i <= 47; i++) {
                shifts[i] = true;
            }

            for (let i = 0; i <= endIndex; i++) {
                shifts[i] = true;
            }
        }
    });


    // Convert the worker shifts map to an array of objects and add to the result
    workerShiftsMap.forEach((shifts, workerID) => {
        workersAndShifts.push({ name: workerID, shifts });
    });
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

export function generateDayList(table) {
    const daysSet = new Set();
    for (let i = 0; i < table.length; i++) {
        daysSet.add(table[i][0]); // Assuming column 1 is at index 0
    }
    const uniqueDays = [...daysSet];
    return uniqueDays;
}


function generateShiftList(table) {
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

export function checkOverlap(start1, end1, start2, end2) {
    return (start1 < end2 && end1 > start2);
}

export function generateShiftsPerWorker(data) {
    const shifts = {
        Sunday: generateWorkerShiftList(data.Sunday),
        Monday: generateWorkerShiftList(data.Monday),
        Tuesday: generateWorkerShiftList(data.Tuesday),
        Wednesday: generateWorkerShiftList(data.Wednesday),
        Thursday: generateWorkerShiftList(data.Thursday),
        Friday: generateWorkerShiftList(data.Friday),
        Saturday: generateWorkerShiftList(data.Saturday)
    }

    return shifts
}

function generateWorkerShiftList(table) {
    const workerShiftMap = {}; // Use an object to map worker name+id to a Set of shiftIds
    for (let i = 0; i < table.length; i++) {
        const row = table[i];
        const key = row[4]
        if (key === "") {
            continue;
        }

        // Add shiftId to the Set corresponding to the key
        if (!workerShiftMap.hasOwnProperty(key)) {
            // If the key doesn't exist in the map, create a new Set
            workerShiftMap[key] = new Set();
        }
        // Add shiftId to the Set associated with the key
        workerShiftMap[key].add(i);
    }

    return workerShiftMap;
}

export function getWorkerShiftListKey(id, name) {
    return name + "\n" + id
}

export function getShiftsForWorker(workerShiftMap, id, name) {
    const key = getWorkerShiftListKey(id, name);
    if (workerShiftMap.hasOwnProperty(key)) {
        return workerShiftMap[key];
    } else {
        return new Set();
    }
}


export function addShiftToWorker(workerShiftMap, id, name, rowIndex) {
    const key = getWorkerShiftListKey(id, name);

    if (!workerShiftMap.hasOwnProperty(key)) {
        workerShiftMap[key] = new Set();
    }

    workerShiftMap[key].add(rowIndex);

    return workerShiftMap;
}

export function removeShiftFromWorker(workerShiftMap, id, name, rowIndex) {
    const key = getWorkerShiftListKey(id, name);

    if (workerShiftMap.hasOwnProperty(key)) {
        const shiftSet = workerShiftMap[key];

        if (shiftSet.has(rowIndex)) {
            shiftSet.delete(rowIndex);

            if (shiftSet.size === 0) {
                delete workerShiftMap[key];
            }
        }
    }
}






export async function generateAlgo2Results(table) {
    await sleep(10)
    const scheduleDataa = table
    for (let i = 0; i < scheduleDataa.length; i++) {
        // scheduleData[i][4] = (2*i+5) % 10
        scheduleDataa[i][4] = 2
    }
    const scheduleData = duplicateLines(scheduleDataa)
    // console.log("scheduleData : " + scheduleData)
    const scheduleDataSunday = scheduleData.filter(item => item[0].toLowerCase() === "sunday");
    const scheduleDataMonday = scheduleData.filter(item => item[0].toLowerCase() === "monday");
    const scheduleDataTuesday = scheduleData.filter(item => item[0].toLowerCase() === "tuesday");
    const scheduleDataWednesday = scheduleData.filter(item => item[0].toLowerCase() === "wednesday");
    const scheduleDataThursday = scheduleData.filter(item => item[0].toLowerCase() === "thursday");
    const scheduleDataFriday = scheduleData.filter(item => item[0].toLowerCase() === "friday");
    const scheduleDataSaturday = scheduleData.filter(item => item[0].toLowerCase() === "saturday");

    console.log("scheduleDataSunday")
    console.log(scheduleDataSunday)
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
    const existingWorkers = workerTable.map(entry => entry[1] + "\n" + entry[0]);
    const daysWorkersAndShifts = {
        Sunday: generateShifts(data.Sunday, workerTable, existingWorkers),
        Monday: generateShifts(data.Monday, workerTable, existingWorkers),
        Tuesday: generateShifts(data.Tuesday, workerTable, existingWorkers),
        Wednesday: generateShifts(data.Wednesday, workerTable, existingWorkers),
        Thursday: generateShifts(data.Thursday, workerTable, existingWorkers),
        Friday: generateShifts(data.Friday, workerTable, existingWorkers),
        Saturday: generateShifts(data.Saturday, workerTable, existingWorkers)
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
    console.log("table")
    console.log(table)
    var olivia = "Olivia\n12"
    const duplicatedData = [];
    var shiftsId = 0
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i][4]; j++) {
            duplicatedData.push([table[i][1], table[i][0], table[i][2], table[i][3], "", shiftsId]);
        }

        shiftsId++
    }
    console.log("duplicatedData")
    console.log(duplicatedData)
    // table.forEach((value, key) => {
    //     for (let i = 0; i < value.length; i++) {
    //         for (let j = 0; j < value[i][4]; j++) {
    //             duplicatedData.push([value[i][0], value[i][1], value[i][2], value[i][3], "", shiftsId]);
    //         }

    //         shiftsId++
    //     }

    // });
    // console.log("dupliacte lines111 " + duplicatedData)
    return duplicatedData;
}



export async function generateAlgo1Results(table) {
    const scheduleData = table
    for (let i = 0; i < scheduleData.length; i++) {
        // scheduleData[i][4] = (2*i+5) % 10
        scheduleData[i][4] = 1
    }

    const transformedData = transformDataToMap(scheduleData);
    // console.log("hiiiiii" + transformedData["TV technition"]["sunday"]);
    await sleep(10);
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
