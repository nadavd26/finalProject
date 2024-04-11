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


export async function generateAlgo2Results() {
    //empty means no one was selected
    const scheduleDataa = [
        ["sunday", "cable technition", "8:00", "12:00", 3],
        ["sunday", "cable technition", "13:00", "17:00", 9],
        ["monday", "cable technition", "9:00", "13:00", 4],
        ["monday", "cable technition", "14:00", "18:00", 5],
        ["tuesday", "cable technition", "10:00", "14:00", 2],
        ["tuesday", "cable technition", "15:00", "19:00", 6],
        ["wednesday", "cable technition", "11:00", "15:00", 7],
        ["wednesday", "cable technition", "16:00", "20:00", 1],
        ["thursday", "cable technition", "12:00", "16:00", 10],
        ["thursday", "cable technition", "17:00", "21:00", 8],
        ["friday", "cable technition", "13:00", "17:00", 3],
        ["friday", "cable technition", "18:00", "22:00", 9],
        ["saturday", "cable technition", "14:00", "18:00", 6],
        ["saturday", "cable technition", "19:00", "23:00", 2],
        ["sunday", "WIFI technition", "8:00", "12:00", 5],
        ["sunday", "WIFI technition", "13:00", "17:00", 8],
        ["monday", "WIFI technition", "9:00", "13:00", 1],
        ["monday", "WIFI technition", "14:00", "18:00", 4],
        ["tuesday", "WIFI technition", "10:00", "14:00", 7],
        ["tuesday", "WIFI technition", "15:00", "19:00", 3],
        ["Wednesday", "WIFI technition", "11:00", "15:00", 9],
        ["wednesday", "WIFI technition", "16:00", "20:00", 6],
        ["thursday", "WIFI technition", "12:00", "16:00", 8],
        ["thursday", "WIFI technition", "17:00", "21:00", 2],
        ["friday", "WIFI technition", "13:00", "17:00", 10],
        ["friday", "WIFI technition", "18:00", "22:00", 5],
        ["saturday", "WIFI technition", "14:00", "18:00", 7],
        ["saturday", "WIFI technition", "19:00", "23:00", 1],
        ["sunday", "TV technition", "8:00", "12:00", 4],
        ["sunday", "TV technition", "13:00", "17:00", 6],
        ["monday", "TV technition", "9:00", "13:00", 8],
        ["monday", "TV technition", "14:00", "18:00", 2],
        ["tuesday", "TV technition", "10:00", "14:00", 3],
        ["tuesday", "TV technition", "15:00", "19:00", 5],
        ["wednesday", "TV technition", "11:00", "15:00", 9],
        ["wednesday", "TV technition", "16:00", "20:00", 7],
        ["thursday", "TV technition", "12:00", "16:00", 1],
        ["thursday", "TV technition", "17:00", "21:00", 10],
        ["friday", "TV technition", "13:00", "17:00", 6],
        ["friday", "TV technition", "18:00", "22:00", 4],
        ["saturday", "TV technition", "14:00", "18:00", 2],
        ["saturday", "TV technition", "19:00", "23:00", 8]
    ];

    const scheduleData = duplicateLines(scheduleDataa)
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
        const key = getKey(entry[0], entry[1]); // Combining day and skill to form the key
        if (!resultMap.has(key)) {
            resultMap.set(key, []);
        }
        resultMap.get(key).push(entry);
    });

    return resultMap;
}

function duplicateLines(scheduleData) {
    const duplicatedData = [];
    // var j = 0;
    scheduleData.forEach(([day, technician, start, end, count]) => {
        for (let i = 0; i < count; i++) {
            // j++
            duplicatedData.push([day, technician, start, end, ""]);
        }
    });
    return duplicatedData;
}

export async function generateAlgo1Results() {
    const scheduleData = [
        ["sunday", "cable technition", "8:00", "12:00", 15],
        ["sunday", "cable technition", "13:00", "17:00", 12],
        ["monday", "cable technition", "9:00", "13:00", 18],
        ["monday", "cable technition", "14:00", "18:00", 9],
        ["tuesday", "cable technition", "10:00", "14:00", 20],
        ["tuesday", "cable technition", "15:00", "19:00", 7],
        ["wednesday", "cable technition", "11:00", "15:00", 16],
        ["wednesday", "cable technition", "16:00", "20:00", 11],
        ["thursday", "cable technition", "12:00", "16:00", 13],
        ["thursday", "cable technition", "17:00", "21:00", 8],
        ["friday", "cable technition", "13:00", "17:00", 10],
        ["friday", "cable technition", "18:00", "22:00", 6],
        ["saturday", "cable technition", "14:00", "18:00", 14],
        ["saturday", "cable technition", "19:00", "23:00", 5],
        ["sunday", "WIFI technition", "8:00", "12:00", 9],
        ["sunday", "WIFI technition", "13:00", "17:00", 6],
        ["monday", "WIFI technition", "9:00", "13:00", 11],
        ["monday", "WIFI technition", "14:00", "18:00", 8],
        ["tuesday", "WIFI technition", "10:00", "14:00", 13],
        ["tuesday", "WIFI technition", "15:00", "19:00", 10],
        ["Wednesday", "WIFI technition", "11:00", "15:00", 12],
        ["wednesday", "WIFI technition", "16:00", "20:00", 7],
        ["thursday", "WIFI technition", "12:00", "16:00", 15],
        ["thursday", "WIFI technition", "17:00", "21:00", 11],
        ["friday", "WIFI technition", "13:00", "17:00", 14],
        ["friday", "WIFI technition", "18:00", "22:00", 9],
        ["saturday", "WIFI technition", "14:00", "18:00", 16],
        ["saturday", "WIFI technition", "19:00", "23:00", 12],
        ["sunday", "TV technition", "8:00", "12:00", 7],
        ["sunday", "TV technition", "13:00", "17:00", 5],
        ["monday", "TV technition", "9:00", "13:00", 9],
        ["monday", "TV technition", "14:00", "18:00", 6],
        ["tuesday", "TV technition", "10:00", "14:00", 8],
        ["tuesday", "TV technition", "15:00", "19:00", 10],
        ["wednesday", "TV technition", "11:00", "15:00", 7],
        ["wednesday", "TV technition", "16:00", "20:00", 12],
        ["thursday", "TV technition", "12:00", "16:00", 11],
        ["thursday", "TV technition", "17:00", "21:00", 14],
        ["friday", "TV technition", "13:00", "17:00", 10],
        ["friday", "TV technition", "18:00", "22:00", 16],
        ["saturday", "TV technition", "14:00", "18:00", 13],
        ["saturday", "TV technition", "19:00", "23:00", 15]
    ];

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
