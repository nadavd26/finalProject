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


function generateShifts(scheduleData) {
    const workersAndShifts = [];

    // Filter out entries where the last column (workerName) is empty
    const filteredData = scheduleData.filter(entry => entry[4].trim() !== '');

    // Group the filtered schedule data by worker name
    const groupedData = filteredData.reduce((acc, [day, skill, start, end, workerName]) => {
        if (!acc[workerName]) {
            acc[workerName] = [];
        }
        acc[workerName].push({ day, start, end });
        return acc;
    }, {});

    // Generate Boolean arrays for each worker's shifts
    for (const workerName in groupedData) {
        const shifts = new Array(48).fill(false); // Initialize with false for each half-hour slot
        groupedData[workerName].forEach(({ start, end }) => {
            const startIndex = (parseInt(start.split(':')[0]) - 7) * 2;
            const endIndex = (parseInt(end.split(':')[0]) - 7) * 2 + (end.endsWith(':30') ? 1 : 0);
            for (let i = startIndex; i < endIndex; i++) {
                shifts[i] = true; // Set true for each half-hour slot the worker is scheduled
            }
        });
        workersAndShifts.push({ name: workerName, shifts });
    }

    return workersAndShifts;
}



// export async function generateAlgo2Results() {
//     await sleep(5000);
//     const booleanArray = new Array(48).fill(false);
//     // Set some elements to true
//     booleanArray[0] = true;
//     booleanArray[5] = true;
//     booleanArray[10] = true;
//     // Add more true values
//     booleanArray[15] = true;
//     booleanArray[20] = true;
//     booleanArray[25] = true;
//     // ... continue adding more true values as needed
//     const booleanArray2 = new Array(48).fill(false);
//     booleanArray2[13] = true;
//     booleanArray2[14] = true;
//     booleanArray2[15] = true;
//     booleanArray2[10] = true;
//     booleanArray2[47] = true
//     const workersAndShifts1 = [{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }]
//     const workersAndShifts2 = [
//         { name: 'Emily Brown', shifts: booleanArray }, { name: 'Daniel Martinez', shifts: booleanArray2 }, { name: 'Sophia Wilson', shifts: booleanArray2 }, { name: 'Matthew Taylor', shifts: booleanArray }, { name: 'Emily Brown', shifts: booleanArray }, { name: 'Daniel Martinez', shifts: booleanArray2 }, { name: 'Sophia Wilson', shifts: booleanArray2 },
//         { name: 'Matthew Taylor', shifts: booleanArray }, { name: 'Emily Brown', shifts: booleanArray }, { name: 'Daniel Martinez', shifts: booleanArray2 }, { name: 'Sophia Wilson', shifts: booleanArray2 }, { name: 'Matthew Taylor', shifts: booleanArray }, { name: 'Emily Brown', shifts: booleanArray }, { name: 'Daniel Martinez', shifts: booleanArray2 }, { name: 'Sophia Wilson', shifts: booleanArray2 }, { name: 'Matthew Taylor', shifts: booleanArray }, { name: 'Emily Brown', shifts: booleanArray }, { name: 'Daniel Martinez', shifts: booleanArray2 }, { name: 'Sophia Wilson', shifts: booleanArray2 }, { name: 'Matthew Taylor', shifts: booleanArray }
//     ];

//     // Workers for Tuesday
//     const workersAndShifts3 = [
//         { name: 'Olivia Anderson', shifts: booleanArray },
//         { name: 'Liam Thomas', shifts: booleanArray2 },
//         { name: 'Emma Garcia', shifts: booleanArray },
//     ];

//     // Workers for Wednesday
//     const workersAndShifts4 = [
//         { name: 'Ethan Moore', shifts: booleanArray2 },
//         { name: 'Ava Hall', shifts: booleanArray },
//         { name: 'Jackson King', shifts: booleanArray },
//         { name: 'Sophie Green', shifts: booleanArray2 },
//     ];

//     // Workers for Thursday
//     const workersAndShifts5 = [
//         { name: 'Noah Lewis', shifts: booleanArray },
//         { name: 'Isabella White', shifts: booleanArray2 },
//     ];

//     // Workers for Friday
//     const workersAndShifts6 = [
//         { name: 'Mia Clark', shifts: booleanArray },
//         { name: 'Logan Adams', shifts: booleanArray },
//         { name: 'Grace Miller', shifts: booleanArray2 },
//     ];

//     // Workers for Saturday
//     const workersAndShifts7 = [
//         { name: 'Lucas Turner', shifts: booleanArray },
//         { name: 'Ella Scott', shifts: booleanArray },
//         { name: 'Aiden Reed', shifts: booleanArray2 },
//     ];

//     const daysWorkersAndShifts = {
//         Sunday: workersAndShifts1,
//         Monday: workersAndShifts2,
//         Tuesday: workersAndShifts3,
//         Wednesday: workersAndShifts4,
//         Thursday: workersAndShifts5,
//         Friday: workersAndShifts6,
//         Saturday: workersAndShifts7,
//     }

//     return daysWorkersAndShifts
// }

export async function generateAlgo2Results() {
    //empty means no one was selected
    const scheduleDataSunday = [
            ["sunday", "cable technition", "8:00", "12:00", "Bob\n0"],
            ["sunday", "cable technition", "13:00", "17:00", "Alice\n1"],
            ["sunday", "cable technition", "9:00", "13:00", "Charlie\n2"],
            ["sunday", "cable technition", "14:00", "18:00", "David\n3"],
            ["sunday", "cable technition", "10:00", "14:00", "Emma\n4"],
            ["sunday", "cable technition", "15:00", "19:00", "Frank\n5"],
            ["sunday", "cable technition", "11:00", "15:00", "Grace\n6"],
            ["sunday", "cable technition", "16:00", "20:00", "Hannah\n7"],
            ["sunday", "cable technition", "12:00", "16:00", "Isaac\n8"],
            ["sunday", "cable technition", "17:00", "21:00", "Jack\n9"],
            ["sunday", "cable technition", "13:00", "17:00", "Liam\n10"],
            ["sunday", "cable technition", "18:00", "22:00", "Mia\n11"],
            ["sunday", "cable technition", "14:00", "18:00", "Nora\n12"],
            ["sunday", "cable technition", "19:00", "23:00", "Oliver\n13"],
            ["sunday", "WIFI technition", "8:00", "12:00", "Penelope\n14"],
            ["sunday", "WIFI technition", "13:00", "17:00", "Quinn\n15"],
            ["sunday", "WIFI technition", "9:00", "13:00", "Riley\n16"],
            ["sunday", "WIFI technition", "14:00", "18:00", "Sophia\n17"],
            ["sunday", "WIFI technition", "10:00", "14:00", "Thomas\n18"],
            ["sunday", "WIFI technition", "15:00", "19:00", "Bob\n0"],
            ["sunday", "WIFI technition", "11:00", "15:00", "Violet\n20"],
            ["sunday", "WIFI technition", "16:00", "20:00", "Wyatt\n21"],
            ["sunday", "WIFI technition", "12:00", "16:00", "Xavier\n22"],
            ["sunday", "WIFI technition", "17:00", "21:00", "Yara\n23"],
            ["sunday", "WIFI technition", "13:00", "17:00", "Zoe\n24"],
            ["sunday", "WIFI technition", "18:00", "22:00", "Aaron\n25"],
            ["sunday", "WIFI technition", "14:00", "18:00", "Bella\n26"],
            ["sunday", "WIFI technition", "19:00", "23:00", "Bob\n0"],
            ["sunday", "TV technition", "8:00", "12:00", "Dylan\n28"],
            ["sunday", "TV technition", "13:00", "17:00", "Ella\n29"],
            ["sunday", "TV technition", "9:00", "13:00", "Finn\n30"],
            ["sunday", "TV technition", "14:00", "18:00", "Gemma\n31"],
            ["sunday", "TV technition", "10:00", "14:00", "Henry\n32"],
            ["sunday", "TV technition", "15:00", "19:00", "Ivy\n33"],
            ["sunday", "TV technition", "11:00", "15:00", "James\n34"],
            ["sunday", "TV technition", "16:00", "20:00", "Katherine\n35"],
            ["sunday", "TV technition", "12:00", "16:00", "Luna\n36"],
            ["sunday", "TV technition", "17:00", "21:00", "Milo\n37"],
            ["sunday", "TV technition", "13:00", "17:00", "Natalie\n38"],
            ["sunday", "TV technition", "18:00", "22:00", "Oscar\n39"]
    ];

    // Monday - 5 lines
const scheduleDataMonday = [
    ["monday", "cable technition", "8:00", "12:00", "Bob\n0"],
    ["monday", "cable technition", "13:00", "17:00", "Alice\n1"],
    ["monday", "cable technition", "9:00", "13:00", "Charlie\n2"],
    ["monday", "cable technition", "14:00", "18:00", "David\n3"],
    ["monday", "cable technition", "10:00", "14:00", "Emma\n4"],
];

// Tuesday - 6 lines
const scheduleDataTuesday = [
    ["tuesday", "cable technition", "15:00", "19:00", "Frank\n5"],
    ["tuesday", "cable technition", "11:00", "15:00", "Grace\n6"],
    ["tuesday", "cable technition", "16:00", "20:00", "Hannah\n7"],
    ["tuesday", "cable technition", "12:00", "16:00", "Isaac\n8"],
    ["tuesday", "cable technition", "17:00", "21:00", "Jack\n9"],
    ["tuesday", "cable technition", "13:00", "17:00", "Liam\n10"],
];

// Wednesday - 7 lines
const scheduleDataWednesday = [
    ["wednesday", "cable technition", "13:00", "17:00", "Liam\n10"],
    ["wednesday", "cable technition", "18:00", "22:00", "Mia\n11"],
    ["wednesday", "cable technition", "14:00", "18:00", "Nora\n12"],
    ["wednesday", "cable technition", "19:00", "23:00", "Oliver\n13"],
    ["wednesday", "WIFI technition", "8:00", "12:00", "Penelope\n14"],
    ["wednesday", "WIFI technition", "13:00", "17:00", "Quinn\n15"],
    ["wednesday", "WIFI technition", "9:00", "13:00", "Riley\n16"],
];

// Thursday - 8 lines
const scheduleDataThursday = [
    ["thursday", "WIFI technition", "14:00", "18:00", ""],
    ["thursday", "WIFI technition", "10:00", "14:00", "Thomas\n18"],
    ["thursday", "TV technition", "8:00", "12:00", "Dylan\n28"],
    ["thursday", "TV technition", "13:00", "17:00", "Ella\n29"],
    ["thursday", "TV technition", "9:00", "13:00", "Finn\n30"],
    ["thursday", "TV technition", "14:00", "18:00", "Gemma\n31"],
    ["thursday", "TV technition", "10:00", "14:00", "Henry\n32"],
    ["thursday", "TV technition", "15:00", "19:00", "Ivy\n33"],
];

// Friday - 9 lines
const scheduleDataFriday = [
    ["friday", "WIFI technition", "15:00", "19:00", "Bob\n0"],
    ["friday", "WIFI technition", "11:00", "15:00", "Violet\n20"],
    ["friday", "WIFI technition", "16:00", "20:00", "Wyatt\n21"],
    ["friday", "WIFI technition", "12:00", "16:00", "Xavier\n22"],
    ["friday", "WIFI technition", "17:00", "21:00", "Yara\n23"],
    ["friday", "WIFI technition", "13:00", "17:00", "Zoe\n24"],
    ["friday", "WIFI technition", "18:00", "22:00", "Aaron\n25"],
    ["friday", "WIFI technition", "14:00", "18:00", "Bella\n26"],
    ["friday", "WIFI technition", "19:00", "23:00", "Bob\n0"],
];

// Saturday - 10 lines
const scheduleDataSaturday = [
    ["saturday", "TV technition", "8:00", "12:00", "Dylan\n28"],
    ["saturday", "TV technition", "13:00", "17:00", "Ella\n29"],
    ["saturday", "TV technition", "9:00", "13:00", "Finn\n30"],
    ["saturday", "TV technition", "14:00", "18:00", "Gemma\n31"],
    ["saturday", "TV technition", "10:00", "14:00", "Henry\n32"],
    ["saturday", "TV technition", "15:00", "19:00", "Ivy\n33"],
    ["saturday", "TV technition", "11:00", "15:00", "James\n34"],
    ["saturday", "TV technition", "16:00", "20:00", "Katherine\n35"],
    ["saturday", "TV technition", "12:00", "16:00", "Luna\n36"],
    ["saturday", "TV technition", "17:00", "21:00", "Milo\n37"],
];

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

export function generateAlgoGraphicResults(data) {
    const daysWorkersAndShifts = {
        Sunday: generateShifts(data.Sunday),
        Monday: generateShifts(data.Monday),
        Tuesday: generateShifts(data.Tuesday),
        Wednesday: generateShifts(data.Wednesday),
        Thursday: generateShifts(data.Thursday),
        Friday: generateShifts(data.Friday),
        Saturday: generateShifts(data.Saturday)
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



export async function generateAlgo1Results() {
    const scheduleData = [
        ["sunday", "cable technition", "8:00", "12:00", 150],
        ["sunday", "cable technition", "13:00", "17:00", 120],
        ["monday", "cable technition", "9:00", "13:00", 180],
        ["monday", "cable technition", "14:00", "18:00", 90],
        ["tuesday", "cable technition", "10:00", "14:00", 200],
        ["tuesday", "cable technition", "15:00", "19:00", 70],
        ["wednesday", "cable technition", "11:00", "15:00", 160],
        ["wednesday", "cable technition", "16:00", "20:00", 110],
        ["thursday", "cable technition", "12:00", "16:00", 130],
        ["thursday", "cable technition", "17:00", "21:00", 80],
        ["friday", "cable technition", "13:00", "17:00", 100],
        ["friday", "cable technition", "18:00", "22:00", 60],
        ["saturday", "cable technition", "14:00", "18:00", 140],
        ["saturday", "cable technition", "19:00", "23:00", 50],
        ["sunday", "WIFI technition", "8:00", "12:00", 90],
        ["sunday", "WIFI technition", "13:00", "17:00", 60],
        ["monday", "WIFI technition", "9:00", "13:00", 110],
        ["monday", "WIFI technition", "14:00", "18:00", 80],
        ["tuesday", "WIFI technition", "10:00", "14:00", 130],
        ["tuesday", "WIFI technition", "15:00", "19:00", 100],
        ["Wednesday", "WIFI technition", "11:00", "15:00", 120],
        ["wednesday", "WIFI technition", "16:00", "20:00", 70],
        ["thursday", "WIFI technition", "12:00", "16:00", 150],
        ["thursday", "WIFI technition", "17:00", "21:00", 110],
        ["friday", "WIFI technition", "13:00", "17:00", 140],
        ["friday", "WIFI technition", "18:00", "22:00", 90],
        ["saturday", "WIFI technition", "14:00", "18:00", 160],
        ["saturday", "WIFI technition", "19:00", "23:00", 120],
        ["sunday", "TV technition", "8:00", "12:00", 70],
        ["sunday", "TV technition", "13:00", "17:00", 50],
        ["monday", "TV technition", "9:00", "13:00", 90],
        ["monday", "TV technition", "14:00", "18:00", 60],
        ["tuesday", "TV technition", "10:00", "14:00", 80],
        ["tuesday", "TV technition", "15:00", "19:00", 100],
        ["wednesday", "TV technition", "11:00", "15:00", 70],
        ["wednesday", "TV technition", "16:00", "20:00", 120],
        ["thursday", "TV technition", "12:00", "16:00", 110],
        ["thursday", "TV technition", "17:00", "21:00", 140],
        ["friday", "TV technition", "13:00", "17:00", 100],
        ["friday", "TV technition", "18:00", "22:00", 160],
        ["saturday", "TV technition", "14:00", "18:00", 130],
        ["saturday", "TV technition", "19:00", "23:00", 150]
    ];
    const transformedData = transformDataToMap(scheduleData);
    // console.log("hiiiiii" + transformedData["TV technition"]["sunday"]);
    await sleep(2000);
    return transformedData
}

export function getKey(day, skill) {
    return (day).toLowerCase()  + "*" + skill
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
