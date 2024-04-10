async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateAlgo2Results() {
    await sleep(5000);
    const booleanArray = new Array(48).fill(false);
    // Set some elements to true
    booleanArray[0] = true;
    booleanArray[5] = true;
    booleanArray[10] = true;
    // Add more true values
    booleanArray[15] = true;
    booleanArray[20] = true;
    booleanArray[25] = true;
    // ... continue adding more true values as needed
    const booleanArray2 = new Array(48).fill(false);
    booleanArray2[13] = true;
    booleanArray2[14] = true;
    booleanArray2[15] = true;
    booleanArray2[10] = true;
    booleanArray2[47] = true
    const workersAndShifts1 = [{ name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }, { name: 'Nadav\n214437550', shifts: booleanArray }, { name: 'Amit\n32276543', shifts: booleanArray2 }]
    const workersAndShifts2 = [
        { name: 'Emily Brown', shifts: booleanArray }, { name: 'Daniel Martinez', shifts: booleanArray2 }, { name: 'Sophia Wilson', shifts: booleanArray2 }, { name: 'Matthew Taylor', shifts: booleanArray }, { name: 'Emily Brown', shifts: booleanArray }, { name: 'Daniel Martinez', shifts: booleanArray2 }, { name: 'Sophia Wilson', shifts: booleanArray2 },
        { name: 'Matthew Taylor', shifts: booleanArray }, { name: 'Emily Brown', shifts: booleanArray }, { name: 'Daniel Martinez', shifts: booleanArray2 }, { name: 'Sophia Wilson', shifts: booleanArray2 }, { name: 'Matthew Taylor', shifts: booleanArray }, { name: 'Emily Brown', shifts: booleanArray }, { name: 'Daniel Martinez', shifts: booleanArray2 }, { name: 'Sophia Wilson', shifts: booleanArray2 }, { name: 'Matthew Taylor', shifts: booleanArray }, { name: 'Emily Brown', shifts: booleanArray }, { name: 'Daniel Martinez', shifts: booleanArray2 }, { name: 'Sophia Wilson', shifts: booleanArray2 }, { name: 'Matthew Taylor', shifts: booleanArray }
    ];

    // Workers for Tuesday
    const workersAndShifts3 = [
        { name: 'Olivia Anderson', shifts: booleanArray },
        { name: 'Liam Thomas', shifts: booleanArray2 },
        { name: 'Emma Garcia', shifts: booleanArray },
    ];

    // Workers for Wednesday
    const workersAndShifts4 = [
        { name: 'Ethan Moore', shifts: booleanArray2 },
        { name: 'Ava Hall', shifts: booleanArray },
        { name: 'Jackson King', shifts: booleanArray },
        { name: 'Sophie Green', shifts: booleanArray2 },
    ];

    // Workers for Thursday
    const workersAndShifts5 = [
        { name: 'Noah Lewis', shifts: booleanArray },
        { name: 'Isabella White', shifts: booleanArray2 },
    ];

    // Workers for Friday
    const workersAndShifts6 = [
        { name: 'Mia Clark', shifts: booleanArray },
        { name: 'Logan Adams', shifts: booleanArray },
        { name: 'Grace Miller', shifts: booleanArray2 },
    ];

    // Workers for Saturday
    const workersAndShifts7 = [
        { name: 'Lucas Turner', shifts: booleanArray },
        { name: 'Ella Scott', shifts: booleanArray },
        { name: 'Aiden Reed', shifts: booleanArray2 },
    ];

    const daysWorkersAndShifts = {
        Sunday: workersAndShifts1,
        Monday: workersAndShifts2,
        Tuesday: workersAndShifts3,
        Wednesday: workersAndShifts4,
        Thursday: workersAndShifts5,
        Friday: workersAndShifts6,
        Saturday: workersAndShifts7,
    }

    return daysWorkersAndShifts
}

function transformDataToMap(data) {
    const resultMap = new Map();

    data.forEach(entry => {
        const key = entry[0] + '-' + entry[1]; // Combining day and skill to form the key
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
    return (day).toLowerCase()  + "-" + skill
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
