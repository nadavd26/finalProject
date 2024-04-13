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
    // Extract all worker IDs from workerTable
    // Extract all worker IDs from workerTable
    const existingWorkers = workerTable.map(entry => entry[1] + "\n" + entry[0]);

    // Extract all worker IDs from scheduleData
    const scheduleWorkerIDs = scheduleData.map(entry => entry[4]);

    // Filter scheduleData to only include worker IDs not in existingWorkers
    const newWorkers = existingWorkers.filter(workerID => !scheduleWorkerIDs.includes(workerID));
    // For each new worker, create an array filled with false for each half-hour slot
    newWorkers.forEach(worker => {
        const shifts = new Array(48).fill(false);
        workersAndShifts.push({ name: worker, shifts });
    });

    // Filter out entries where the last column (worker ID) is empty
    const filteredData = scheduleData.filter(entry => entry[4].trim() !== '');

    // Group the filtered schedule data by worker ID
    const groupedData = filteredData.reduce((acc, [day, skill, start, end, workerID]) => {
        if (!acc[workerID]) {
            acc[workerID] = [];
        }
        acc[workerID].push({ day, start, end });
        return acc;
    }, {});

    // Generate Boolean arrays for each worker's shifts
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


function mapToString(map) {
    let str = '';
    map.forEach((value, key) => {
        str += `${key}: ${value}\n`; // Assuming key and value are strings
    });
    return str;
}

export async function generateAlgo2Results(table) {
    //empty means no one was selected
    const scheduleData = duplicateLines(table)
    console.log("scheduleData : " + scheduleData)
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
    console.log("data : " + JSON.stringify(data))

    return data

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
    table.forEach((value, key) => {
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < value[i][4]; j++) {
                duplicatedData.push([value[i][0], value[i][1], value[i][2], value[i][3], ""]);
            }
        }

    });
    return duplicatedData;
}



export async function generateAlgo1Results(table) {
    const scheduleData = table
    for (let i = 0; i < scheduleData.length; i++) {
        scheduleData[i][4] = i % 10
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
