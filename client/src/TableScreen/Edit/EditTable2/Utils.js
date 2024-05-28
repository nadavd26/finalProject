export function generateWorkerList(table1) {
    var workerList = []
    for (let i = 0; i < table1.length; i++) {
        workerList.push(table1[i][1] + "\n" + table1[i][0])
    }

    return workerList
}

export function getShiftsForWorker(workerShiftMap, id, name) {
    const key = getWorkerShiftListKey(id, name);
    if (workerShiftMap.hasOwnProperty(key)) {
        return workerShiftMap[key];
    } else {
        return new Set();
    }
}

export function checkOverlap(start1, end1, start2, end2) {
    return (start1 < end2 && end1 > start2);
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

export function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            return mid; // Found the target
        } else if (arr[mid] < target) {
            left = mid + 1; // Search the right half
        } else {
            right = mid - 1; // Search the left half
        }
    }

    return -1; // Target not found
}

export function getWorkerShiftListKey(id, name) {
    return name + "\n" + id
}


export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
