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

export async function generateAlgo1Results() {
    await sleep(5000);
    return []
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
