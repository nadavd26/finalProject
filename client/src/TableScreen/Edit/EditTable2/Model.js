import * as editAlgo2Utils from './Utils'
import * as utils from '../../Utils'
/**
 * Filters a table based on several search criteria.
 *
 * @param {Array} table - A 2D array representing the table data. Each row is an array containing day, skill, from, until, assigned, and shiftIndex values.
 * @param {Object} daySearch - An object with a `value` property representing the search criterion for the day.
 * @param {Object} skillSearch - An object with a `value` property representing the search criterion for the skill.
 * @param {Object} fromSearch - An object with a `value` property representing the search criterion for the from time.
 * @param {Object} untilSearch - An object with a `value` property representing the search criterion for the until time.
 * @param {Object} assignedSearch - An object with a `value` property representing the search criterion for the assigned status.
 * @param {Object} shiftIndexSearch - An object with a `value` property representing the search criterion for the shift index.
 * @param {Array} colors - An array of strings representing the colors associated with each row in the table.
 * @returns {Array} - An array of indices representing the rows in the table that match the search criteria.
 */
export function filter(table, daySearch, skillSearch, fromSearch, untilSearch, assignedSearch, shiftIndexSearch, colors) {
    var newLinesFiltered = []
    const timeIndexMap = {
        "00:00": 0, "00:30": 1, "01:00": 2, "01:30": 3, "02:00": 4, "02:30": 5,
        "03:00": 6, "03:30": 7, "04:00": 8, "04:30": 9, "05:00": 10, "05:30": 11,
        "06:00": 12, "06:30": 13, "07:00": 14, "07:30": 15, "08:00": 16, "08:30": 17,
        "09:00": 18, "09:30": 19, "10:00": 20, "10:30": 21, "11:00": 22, "11:30": 23,
        "12:00": 24, "12:30": 25, "13:00": 26, "13:30": 27, "14:00": 28, "14:30": 29,
        "15:00": 30, "15:30": 31, "16:00": 32, "16:30": 33, "17:00": 34, "17:30": 35,
        "18:00": 36, "18:30": 37, "19:00": 38, "19:30": 39, "20:00": 40, "20:30": 41,
        "21:00": 42, "21:30": 43, "22:00": 44, "22:30": 45, "23:00": 46, "23:30": 47, "24:00": 48
    };
    for (let i = 0; i < table.length; i++) {
        var goodLine = true
        const [day, skill, from, until, assigned, shiftIndex] = table[i]

        if (daySearch.value != "" && daySearch.value != day) {
            goodLine = false
        }
        if (skillSearch.value != "" && skillSearch.value != skill) {
            goodLine = false
        }
        if (fromSearch.value != "" && timeIndexMap[fromSearch.value] > timeIndexMap[from]) {
            goodLine = false
        }
        if (untilSearch.value != "" && timeIndexMap[untilSearch.value] < timeIndexMap[until]) {
            goodLine = false
        }
        if (assignedSearch.value != "" && assignedSearch.value != "+" && assignedSearch.value != "-" && assignedSearch.value != "$" && assignedSearch.value != "^" && assignedSearch.value != "&" && assignedSearch.value != assigned) {
            goodLine = false
        }

        if (assignedSearch.value == "$" && !(colors[i].includes("red"))) {
            goodLine = false
        }

        if (assignedSearch.value == "^" && !(colors[i].includes("yellow"))) {
            goodLine = false
        }

        if (assignedSearch.value == "&" && !(colors[i].includes("orange"))) {
            goodLine = false
        }

        if (assignedSearch.value == "+" && assigned == "") {
            goodLine = false
        }

        if (assignedSearch.value == "-" && assigned != "") {
            goodLine = false
        }
        if (shiftIndexSearch.value != "" && shiftIndexSearch.value - 1 != shiftIndex) {
            goodLine = false
        }

        if (goodLine) {
            newLinesFiltered.push(i)
        }
    }
    return newLinesFiltered
}

/**
 * Evaluates the status of colors and contract assignments, returning a JSON object with the status.
 *
 * @param {Array<string>} colors - An array of strings representing the colors associated with each item.
 * @param {Object} contracts - An object where each key is a contract identifier (name and id separated by '\n'), and each value is an object with `minHours`, `maxHours`, and `assignment` properties.
 * @returns {Object} - A JSON object containing `isValid`, `isWarning`, and `violations` properties.
 * 
 * @property {boolean} isValid - Indicates if there are no red colors in the `colors` array.
 * @property {boolean} isWarning - Indicates if there are any contract assignments that violate their hour constraints.
 * @property {Array<string>} violations - An array of violation descriptions if any contract assignments are outside their specified hour constraints.
 */
export function getStatus(table, colors, contracts) {
    var isValid = true;
    var isViolation = false
    var violations = []
    var isUnassigned = false
    for (let i = 0; i < colors.length; i++) {
        const color = colors[i]
        if (color.includes("red")) {
            isValid = false
        }
    }

    for (const contractId in contracts) {
        if (contracts.hasOwnProperty(contractId)) {
            const contract = contracts[contractId];
            const [name, id] = contractId.split('\n');
            if (contract.assignment < contract.minHours || contract.assignment > contract.maxHours) {
                // console.log("hshs")
                if (violations.length >= 5) {
                    violations.push("...")
                    break
                }
                if(violations.length == 0) {
                    violations.push("There are some contract violations")
                }
                // violations.push({name: name, id:id, minHours: contract.minHours, maxHours: contract.maxHours, assignment: contract.assignment})
                if (contract.assignment < contract.minHours) {
                    violations.push("- name: " + name + " , id: " + id + " , hours missing: " + (contract.minHours - contract.assignment))
                } else {
                    violations.push("- name: " + name + " , id: " + id + " , hours excessing: " + (contract.assignment - contract.maxHours))
                }

                isViolation = true
            }
        }
    }

    for(let i = 0; i < table.length; i++) {
        if(table[i][4] == "") {
            isUnassigned = true
        }
    }

    return {isValid, isViolation, violations, isUnassigned}
}

function getAbsuluteIndex(relativeIndex, initialTable, day) {
    return firstIndex(initialTable, day) + relativeIndex
}

function getRelativeIndex(absuluteIndex, initialTable, day) {
    return absuluteIndex - firstIndex(initialTable, day)
}

function firstIndex(initialTable, day) {
    var sum = 0;
    if (day === "Sunday") {
        return sum;
    }
    sum += initialTable.Sunday.length;
    if (day === "Monday") {
        return sum;
    }
    sum += initialTable.Monday.length;
    if (day === "Tuesday") {
        return sum;
    }
    sum += initialTable.Tuesday.length;
    if (day === "Wednesday") {
        return sum;
    }
    sum += initialTable.Wednesday.length;
    if (day === "Thursday") {
        return sum;
    }
    sum += initialTable.Thursday.length;
    if (day === "Friday") {
        return sum;
    }
    sum += initialTable.Friday.length;
    if (day === "Saturday") {
        return sum;
    }
}

function getShifts(worker, initialTable, shiftsPerWorkers) {
    var shifts = []
    // const parts = inputString.split(',');
    // const worker = parts.slice(0, 2).join('\n');
    // console.log("worker")
    // console.log(worker)
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    for (let i = 0; i < days.length; i++) {
        var length = 0
        var workersDay = shiftsPerWorkers[days[i]]
        // console.log("workersDay")
        // console.log(workersDay)
        if (!!workersDay) {
            var workerDay = workersDay[worker]
            // console.log("workerDay")
            // console.log(workerDay)
            if (!!workerDay) {
                workerDay.forEach((element) => shifts.push(getAbsuluteIndex(element, initialTable, days[i])))
            }
        }
    }

    return shifts
}

function removeColor(start, colorToRemove) {
    // Use the replace method with a regular expression and the global flag to remove all instances
    const regex = new RegExp(colorToRemove, 'g');
    var res = start.replace(regex, '');
    if (!res || res.length == 0) {
        return "white"
    }

    return res
}

function addColor(start, newColor) {
    return start + newColor
}

/**
 * Edits a row in the table, updates the worker assignments, and adjusts the colors and shifts based on the changes.
 *
 * @param {Array} table - A 2D array representing the table data.
 * @param {Array} initialTable - A json mapping between days to their lines.
 * @param {number} rowIndex - The index of the row to be edited.
 * @param {Array<string>} colors - An array of strings representing the colors associated with each row in the table.
 * @param {string} newWorker - A string containing the new worker's name, ID, and color, separated by commas.
 * @param {Object} contracts - An object where each key is a worker identifier (name and id separated by '\n'), and each value is an object with `minHours`, `maxHours`, and `assignment` properties.
 * @param {Object} shiftsPerWorkers - An object where each key is a day, and each value is an object containing the shifts for each worker.
 * @returns {Object} - An object containing `newTable`, `newColors`, and `newShiftPerWorkers`.
 * 
 * @property {Array} newTable - The updated table after the edit.
 * @property {Array<string>} newColors - The updated colors after the edit.
 * @property {Object} newShiftPerWorkers - The updated shifts per workers after the edit.
 */
export function edit(table,initialTable,rowIndex, colors, newWorker, contracts, shiftsPerWorkers, changeInfo) {
    // console.log("table")
    // console.log(table)
    const row = (table)[rowIndex]
    console.log("row")
    console.log(row)
    
    const day = editAlgo2Utils.capitalizeFirstLetter(row[0])
    var newTable = table
    const oldColor = (colors)[rowIndex]
    var newColors = colors
    
    const [newName = "", newId = "", newColor = "white"] = newWorker.split(",")
    //chanegInfo
    var newChangeInfo = changeInfo
    var max = 100
    var min  = 1
    var id = Math.floor(Math.random() * (max - min + 1)) + min; //row[6]
    newChangeInfo[id] = newName == "" ? "" : newName + "\n" + newId
    console.log("newChangeInfo")
    console.log(newChangeInfo)
    //end changeInfo
    const [oldName, oldId] = (row[4]).split("\n")
    const oldWorker = oldName + "\n" + oldId
    const newContracts = contracts
    // console.log("newContracts")
    // console.log(newContracts)
    // console.log("oldWorker")
    // console.log(oldWorker)
    // console.log("newWorker")
    // console.log(newWorker)
    // console.log(" newContracts[oldWorker]")
    // console.log(newContracts[oldWorker])
    // console.log("newContracts[newWorker]")
    // console.log(newContracts[newName + "\n" + newId])
    if (newContracts.hasOwnProperty(oldWorker)) { //maybe ""
        newContracts[oldWorker].assignment -= utils.calculateHours(row[2], row[3])
    }

    if (newContracts.hasOwnProperty(newName + "\n" + newId)) {
        newContracts[newName + "\n" + newId].assignment += utils.calculateHours(row[2], row[3])
    }
    const oldWorkerContract = newContracts[oldWorker]
    const newWorkerContract = newContracts[newName + "\n" + newId]
    // console.log("newContracts")
    // console.log(newContracts)
    var newShiftPerWorkersDay = newName != "" ? editAlgo2Utils.addShiftToWorker((shiftsPerWorkers)[day], newId, newName, getRelativeIndex(rowIndex,initialTable,day)) : (shiftsPerWorkers)[day]
    editAlgo2Utils.removeShiftFromWorker(newShiftPerWorkersDay, oldId, oldName, getRelativeIndex(rowIndex,initialTable,day))
    var newShiftPerWorkers = shiftsPerWorkers
    newShiftPerWorkers[day] = newShiftPerWorkersDay
    var oldWorkerShifts = getShifts(oldWorker,initialTable,newShiftPerWorkers)
    newTable[rowIndex][4] = (newName == "") ? "" : newName + "\n" + newId
    newColors[rowIndex] = newColor
    if (newColor.includes("red")) { //checking for overlapping shifts to color in red
        const shiftsOfNewWorker = editAlgo2Utils.getShiftsForWorker((shiftsPerWorkers)[day], newId, newName)
        for (const relativeIndex of shiftsOfNewWorker) {
            const absuluteIndex = getAbsuluteIndex(relativeIndex, initialTable, day)
            const from = (table)[absuluteIndex][2]
            const until = (table)[absuluteIndex][3]
            if (editAlgo2Utils.checkOverlap(from, until, row[2], row[3])) { //overlaps with some shift of new worker
                if (newColors[absuluteIndex] != "white" && !((newColors[absuluteIndex]).includes("red"))) {
                    newColors[absuluteIndex] = "red" + newColors[absuluteIndex]
                }
                if (newColors[absuluteIndex] == "white") {
                    newColors[absuluteIndex] = "red"
                }
            }
        }
    }

    if (oldColor.includes("red")) {//removing the overlaps of the old worker
        const shiftsOfOldWorker = editAlgo2Utils.getShiftsForWorker(newShiftPerWorkersDay, oldId, oldName)
        for (const relativeIndex of shiftsOfOldWorker) {
            const absuluteIndex = getAbsuluteIndex(relativeIndex, initialTable, day)
            const from = (table)[absuluteIndex][2]
            const until = (table)[absuluteIndex][3]
            if (editAlgo2Utils.checkOverlap(from, until, row[2], row[3])) {
                var found = false
                const shiftsOfOldWorker2 = shiftsOfOldWorker
                for (const relativeIndex2 of shiftsOfOldWorker2) {
                    if (relativeIndex2 != relativeIndex) { //check overlap for other shift that isnt the shift we are checking
                        const absuluteIndex2 = getAbsuluteIndex(relativeIndex2, initialTable, day)
                        const from2 = (table)[absuluteIndex2][2]
                        const until2 = (table)[absuluteIndex2][3]
                        if (editAlgo2Utils.checkOverlap(from, until, from2, until2)) {
                            found = true
                        }
                    }
                }

                if (!found) { //only overlap it has it is with the original shift
                    newColors[absuluteIndex] = removeColor(newColors[absuluteIndex], "red")
                }
            }
        }
    }


    const parts = newWorker.split(',');
    const newWorkerString = parts.slice(0, 2).join('\n');
    var newWorkerShifts = getShifts(newWorkerString,initialTable,newShiftPerWorkers)


    for (let i = 0; i < newWorkerShifts.length; i++) {
        const absuluteIndex = newWorkerShifts[i]
        if (newWorkerContract.assignment <= newWorkerContract.maxHours && newWorkerContract.assignment >= newWorkerContract.minHours) { //valid
            newColors[absuluteIndex] = removeColor(newColors[absuluteIndex], "yellow")
            newColors[absuluteIndex] = removeColor(newColors[absuluteIndex], "orange")
        }

        if (newWorkerContract.assignment < newWorkerContract.minHours) { //too less hours
            newColors[absuluteIndex] = addColor(newColors[absuluteIndex], "yellow")
        }

        if (newWorkerContract.assignment > newWorkerContract.maxHours) { //too much
            newColors[absuluteIndex] = addColor(newColors[absuluteIndex], "orange")
        }
    }

    if (newColor.includes("green")) {
        newColors[rowIndex] = removeColor(newColors[rowIndex], "green")
    }

    for (let i = 0; i < oldWorkerShifts.length; i++) {
        const absuluteIndex = oldWorkerShifts[i]
        if (oldWorkerContract.assignment <= oldWorkerContract.maxHours && oldWorkerContract.assignment >= oldWorkerContract.minHours) { //valid
            newColors[absuluteIndex] = removeColor(newColors[absuluteIndex], "yellow")
            newColors[absuluteIndex] = removeColor(newColors[absuluteIndex], "orange")
        }

        if (oldWorkerContract.assignment < oldWorkerContract.minHours) { //too less hours
            newColors[absuluteIndex] = addColor(newColors[absuluteIndex], "yellow")
        }

        if (oldWorkerContract.assignment > oldWorkerContract.maxHours) { //too much
            newColors[absuluteIndex] = addColor(newColors[absuluteIndex], "orange")
        }
    }

    return {newTable, newColors, newShiftPerWorkers, newChangeInfo}
}

function getColor(id, name, day, row, contracts, shiftsPerWorkers, table, initialTable) {
    const white = "white"
    const red = "red"
    const yellow = "yellow"
    const orange = "orange"
    const green = "green"
    var color = white
    const shiftSet = editAlgo2Utils.getShiftsForWorker((shiftsPerWorkers)[day], id, name);
    // const shiftsWorker = getShifts(name + "\n" + id, shiftsPerWorkers)
    // console.log("shiftsWorker" + shiftsWorker)
    const contract = contracts[name + "\n" + id]
    // console.log("numShifts")
    // console.log(numShifts)
    if (contract.assignment + utils.calculateHours(row[2], row[3]) < contract.minHours) { //selecting worker violates contract
        color = yellow
    } else {
        if (contract.assignment < contract.minHours) {
            color = green
        }
    }
    if (utils.calculateHours(row[2], row[3]) + contract.assignment > contract.maxHours) { //selecting worker violates contract
        if (color != white) {
            color = orange + color
        } else {
            color = orange
        }
    }
    for (const relativeIndex of shiftSet) {
        const absuluteIndex = getAbsuluteIndex(relativeIndex,initialTable,day)
        const shiftRow = (table)[absuluteIndex];

        if (editAlgo2Utils.checkOverlap(shiftRow[2], shiftRow[3], row[2], row[3])) {
            if (color != white) {
                return red + color
            }
            return red
        }
    }
    return color; // Return "white" if no overlap is found
}

/**
 * Generates a list of workers available for assignment based on the skill required for a given shift.
 *
 * @param {number} rowIndex - The index of the row representing the shift in the table.
 * @param {string} day - The day of the week for the shift.
 * @param {Array} table - A 2D array representing the table data.
 * @param {Map} workerMap - A map where each key is a skill and the value is an array of workers with that skill.
 * @param {Object} shiftsInfo - An object containing information about shifts, keyed by day.
 * @param {Object} contracts - An object where each key is a worker identifier (name and id separated by '\n'), and each value is an object containing the properties `minHours`, `maxHours`, and `assignment`.
 * @param {Object} shiftsPerWorkers - An object where each key is a day, and each value is an object containing the shifts for each worker.
 * @param {Array} initialTable - A json mapping between days to their lines.
 * @returns {Array<Object>} - An array containing objects with worker information including id, name, and color.
 * 
 * @property {number} id - The unique identifier of the worker.
 * @property {string} name - The name of the worker.
 * @property {string} color - The color associated with the worker based on their assignments.
 */
export function generateWorkerList(rowIndex, day, table, workerMap, shiftsInfo, contracts, shiftsPerWorkers, initialTable) {
    const row = (table)[rowIndex]
    // console.log("row")
    // console.log(row)
    const skill = row[1];
    if (workerMap.has(skill)) {
        const workerList = workerMap.get(skill);
        const unavaliableWorkers = []
        const start = (shiftsInfo[day][row[5]]).start + firstIndex(initialTable, day)
        const end = (shiftsInfo[day][row[5]]).end + firstIndex(initialTable, day)
        for (let i = start; i <= end; i++) {
            const nameId = ((table))[i][4]
            const [name, id] = (nameId).split("\n")
            unavaliableWorkers.push({ name: name, id: id })
        }
        const filteredWorkerList = workerList.filter(worker => {
            return !unavaliableWorkers.some(unavailable => {
                return unavailable.id === worker.id;
            });
        });
        const transformedWorkerList = [];
        const [name, id] = row[4].split("\n");
        // console.log("filteredWorkerList")
        // console.log(filteredWorkerList)
        for (let i = 0; i < filteredWorkerList.length; i++) {
            const worker = filteredWorkerList[i]
            transformedWorkerList.push({
                id: worker.id, // Assuming the worker object has an id property
                name: worker.name, // Assuming the worker object has a name property
                color: getColor(worker.id, worker.name, day, row, contracts, shiftsPerWorkers, table, initialTable)
            });
        }
        // console.log("transformedWorkerList")
        // console.log(transformedWorkerList)
        return transformedWorkerList; // Return the transformed worker list
    } else {
        // If the skill does not exist in the workerMap, return an empty list
        return [];
    }
}

/**
 * Retrieves information about a specific line in the table, including overlap and contract details.
 *
 * @param {number} absoluteIndex - The index of the row to get information about.
 * @param {Array} table - A 2D array representing the table data.
 * @param {Array} initialTable - A json mapping between days to their lines.
 * @param {Array<string>} colors - An array of strings representing the colors associated with each row in the table.
 * @param {Object} shiftsInfo - An object containing information about shifts, keyed by day.
 * @param {Object} contracts - An object where each key is a worker identifier (name and id separated by '\n'), and each value is an object with `minHours`, `maxHours`, and `assignment` properties.
 * @param {Object} shiftsPerWorkers - An object where each key is a day, and each value is an object containing the shifts for each worker.
 * @returns {Object} - An object containing `overlapMsg` and `contractMsg`.
 * 
 * @property {string} overlapMsg - A message indicating if there are overlapping shifts and their indexes.
 * @property {string} contractMsg - A message indicating if there are any contract violations and their details.
 */
export function getLineInfo(absuluteIndex, table, colors, shiftsInfo, contracts, shiftsPerWorkers, initialTable) {
    var overlapsLineNumbers = []
    var contractMsg = "No Contract Violation"
    const row = (table)[absuluteIndex]
    const day = editAlgo2Utils.capitalizeFirstLetter(row[0])
    const worker = row[4]
    if (colors[absuluteIndex].includes("red")) {
        const shiftsId = row[5]
        const shiftEntry = shiftsInfo[day][shiftsId]
        const overlaps = shiftEntry.overlaps
        for (const overlapId of overlaps) {
            if (overlapId == shiftsId) {
                continue //same shift does not count as overlap
            }
            var overlapEntry = shiftsInfo[day][overlapId]
            var start = getAbsuluteIndex(overlapEntry.start, initialTable, day)
            var end = getAbsuluteIndex(overlapEntry.end,initialTable, day)
            for (let i = start; i <= end; i++) {
                if ((table)[i][4] == worker) {
                    overlapsLineNumbers.push(i + 1) //numbers start from 1, not from 0
                }
            }
        }
    }

    const contract = contracts[worker]

    if ((colors[absuluteIndex]).includes("orange")) {
        var workerShifts = getShifts(worker,initialTable, shiftsPerWorkers, 1)
        workerShifts = workerShifts.filter(item => item != (absuluteIndex))
        workerShifts = workerShifts.map((item, index) => item + 1);
        workerShifts.sort((a, b) => a - b);
        var otherAss = workerShifts.join(", ")
        contractMsg = "Maximum hours per week: " + contract.maxHours + ", number of hours: " + (contract.assignment) + "." + (otherAss != [] ? ("\nOther assigments of this worker at indexes: " + otherAss) : " Number of shifts: 1")
    }

    if ((colors[absuluteIndex]).includes("yellow")) {
        contractMsg = "Minimum hours per week: " + contract.minHours + ", number of hours: " + (contract.assignment)
    }

    // console.log("overlapsLineNumbers")
    // console.log(overlapsLineNumbers)
    var overlapMsg = "No overlapping shifts"
    if (overlapsLineNumbers.length > 0) {
        overlapMsg = "Overlapping shifts of this shift (index " + (absuluteIndex + 1) + ") at indexes: " + overlapsLineNumbers.join(", ")
    }

    return {overlapMsg, contractMsg}
}

/**
 * Initializes an array of colors based on the initial table data and worker contracts.
 *
 * @param {Array} initialTable - A json mapping between days to their lines.
 * @param {Object} contracts - An object where each key is a worker identifier (name and id separated by '\n'), and each value is an object containing the properties `minHours`, `maxHours`, and `assignment`.
 * @returns {Array<string>} - An array of colors corresponding to each shift in the initial table.
 */
export function initialColors(initialTable, contracts) {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var colors = []
    for (let i = 0; i < days.length; i++) {
        const table = initialTable[days[i]]
        for (let j = 0; j < table.length; j++) {
            const row = table[j]
            const assigned = row[4]
            const contract = contracts[assigned]
            if (contract) {
                if (contract.minHours > contract.assignment) {
                    colors.push("yellow")
                } else {
                    if (contract.maxHours < contract.assignment) {
                        colors.push("orange")
                    } else { //valid
                        colors.push("white")
                    }
                }
            } else {
                colors.push("white")
            }
        }
    }
    return colors
}

export function getDayOptions() {
    return { options: ["", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], shownOptions: ["Any", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] }
}

export function getSkillOptions(skillList) {
    var res = { options: ["", ...skillList], shownOptions: ["Any", ...skillList] }
    return res
}

export function getWorkerList(workersTable) {
    const workerList = editAlgo2Utils.generateWorkerList(workersTable)
    var res = { options: ["", "+", "-", "$", "^", "&", ...workerList], shownOptions: ["Any", "Any Assigned Shift", "Any Unassigned Shift", "Overlaps", "Assigned Workers Below Contract", "Assigned Workers Above Contract", ...workerList] }
    return res
}

export function getShiftList(table){
    const uniqueShiftsInfo = new Set();
    const uniqueShiftsShown = new Set();
    for (let i = 0; i < table.length; i++) {
        const shift = table[i][5];
        // uniqueShiftsInfo.add((shift + 1) + " " + table[i][0] + " " + table[i][1] + " " + table[i][2] + " " + table[i][3])
        uniqueShiftsShown.add(shift + 1);
    }

    const shifts = Array.from(uniqueShiftsShown)
    // const shiftsInfo = Array.from(uniqueShiftsInfo)
    var res = { options: ["", ...(shifts)], shownOptions: ["Any", ...(shifts)] };
    // console.log("res");
    // console.log(res); // Log the result
    return res;
};

export function getFromTimeList(){
    const fromTimeList = [
        "00:00", "00:30",
        "01:00", "01:30",
        "02:00", "02:30",
        "03:00", "03:30",
        "04:00", "04:30",
        "05:00", "05:30",
        "06:00", "06:30",
        "07:00", "07:30",
        "08:00", "08:30",
        "09:00", "09:30",
        "10:00", "10:30",
        "11:00", "11:30",
        "12:00", "12:30",
        "13:00", "13:30",
        "14:00", "14:30",
        "15:00", "15:30",
        "16:00", "16:30",
        "17:00", "17:30",
        "18:00", "18:30",
        "19:00", "19:30",
        "20:00", "20:30",
        "21:00", "21:30",
        "22:00", "22:30",
        "23:00", "23:30"
    ];

    const res = { options: ["", ...fromTimeList], shownOptions: ["Any", ...fromTimeList] }
    return res

}

export function getUntilTimeList() {
    const UntilTimeList = [
        "00:30",
        "01:00", "01:30",
        "02:00", "02:30",
        "03:00", "03:30",
        "04:00", "04:30",
        "05:00", "05:30",
        "06:00", "06:30",
        "07:00", "07:30",
        "08:00", "08:30",
        "09:00", "09:30",
        "10:00", "10:30",
        "11:00", "11:30",
        "12:00", "12:30",
        "13:00", "13:30",
        "14:00", "14:30",
        "15:00", "15:30",
        "16:00", "16:30",
        "17:00", "17:30",
        "18:00", "18:30",
        "19:00", "19:30",
        "20:00", "20:30",
        "21:00", "21:30",
        "22:00", "22:30",
        "23:00", "23:30", "24:00"
    ];

    const res = { options: ["", ...UntilTimeList], shownOptions: ["Any", ...UntilTimeList] }
    return res

}
