const User = require("../models/user");
const { sortResults1Map } = require("./tableSorting");

// This function calculate shift length in hours
const calculateShiftLength = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    // Calculate the total hours between start and end time
    return (endHour + endMinute / 60) - (startHour + startMinute / 60);
};

//This function gets the results1 as an array with all the shift lines, and returns a dictionary with shift id
// as key and the shift length as the value. 
const getShifIdToShiftLengthDict = (results1) => {
    return results1.reduce((acc, shift) => {
        acc[shift.id] = calculateShiftLength(shift.start_time, shift.end_time);
        return acc;
    }, {});
}

//This function gets the results from algo2, and returns a map that it's keys are emp_id and values are
//the IDs of all the shifts that this employees was assigned to. 
const transformToEmployeeShiftsMap = (data) => {
    const empMap = new Map();

    data.forEach(({ shift_id, emp_id }) => {
        // If the emp_id is not in the map, initialize it with an empty array
        if (!empMap.has(emp_id)) {
            empMap.set(emp_id, []);
        }

        // Push the shift_id into the array associated with the emp_id key
        empMap.get(emp_id).push(shift_id);
    });

    return empMap;
};


//This function returns a dictionary with employee id as key and the amount of hours he works as value.
const getEmployeesHoursWorkedDict = async (userId, table1) => {
    const user = await User.findById(userId).populate('table1').populate('shiftTables.shifts').populate('assignedShiftTables.assignedShifts');
    const results2 = getAssignedLines(user.assignedShiftTables)
    const employeeToShiftsDict = transformToEmployeeShiftsMap(results2)
    const results1 = transformShiftTablesToArray(user.shiftTables)
    const shiftIdToShiftLengthDict = getShifIdToShiftLengthDict(results1)
    const employeeHoursWorked = {};
    for(const line1 of table1) { //Initializing the dictionary with 0 for every id.
        employeeHoursWorked[line1['id']] = 0 
    }
    employeeToShiftsDict.forEach((shifts, employeeId) => {
        // Calculate the total hours for each employee by summing up the shift lengths
        const totalHours = shifts.reduce((sum, shiftId) => sum + shiftIdToShiftLengthDict[shiftId], 0);
        employeeHoursWorked[employeeId] = totalHours;
    });
    return employeeHoursWorked
}

//This function returns an array of pairs of employee id and shift id when the employee is assigned to that shift.
const getAssignedLines = (assignedShiftTables) => {
    const resultArray = [];
    // Iterate over each shift table in the user's data
    assignedShiftTables.forEach(assignedShiftTable => {
        // Map each shift to an array containing the relevant shift details
        const assignedShiftsData = assignedShiftTable.assignedShifts.filter(assignedShift => assignedShift.workerId != '')
            .map(assignedShift => ({
                "shift_id": assignedShift.realShiftId,
                "emp_id": assignedShift.workerId
            }));

        // Push all the mapped shift data into the resultArray
        resultArray.push(...assignedShiftsData);
    });
    return resultArray;
};

//This function gets the results from algo2, and returns a map that it's keys are shift_id and values are
//the IDs of all the employees that were assigned to that shift. 
const transformToShiftEmployeesMap = (data) => {
    const shiftMap = new Map();

    data.forEach(({ shift_id, emp_id }) => {
        // If the shift_id is not in the map, initialize it with an empty array
        if (!shiftMap.has(shift_id)) {
            shiftMap.set(shift_id, []);
        }

        // Push the emp_id into the array associated with the shift_id key
        shiftMap.get(shift_id).push(emp_id);
    });

    return shiftMap;
};

//This function get the shifts tables in the form they are saved in the DB, and transforms them into an 
//array in which every line is a shift line.
const transformShiftTablesToArray = (shiftTables) => {
    const resultArray = [];
    // Iterate over each shift table in the user's data
    shiftTables.forEach(shiftTable => {
        // Map each shift to an array containing the relevant shift details
        const shiftsData = shiftTable.shifts.map(shift => ({
            "id": shift.id2,
            "skill": shiftTable.skill,
            "day": shiftTable.day,
            "start_time": shift.startTime,
            "end_time": shift.finishTime,
            "required_workers": shift.numOfWorkers,
            "cost": shift.cost
        }));

        // Push all the mapped shift data into the resultArray
        resultArray.push(...shiftsData);
    });

    return resultArray;
};

//This function gets table1 and returns a map when the keys are workers ids and the values are thier names.
const getWorkerNamesMapByUserId = async (table1) => {
    const workerNamesMap = new Map();
    // Iterate through the table1Content and populate the map
    for (const worker of table1) {
        const workerId = worker.id;
        const workerName = worker.name;
        workerNamesMap.set(workerId, workerName); // Set the workerId as the key and workerName as the value
    }

    return workerNamesMap;
};

//Getting the cost of a single shift according to table3.
function getShiftCost(skill, day, startTime, finishTime, table3) {
    for (line3 of table3) {
        if (line3[0] == skill && line3[1] == day && line3[2] == startTime && line3[3] == finishTime)
            return line3[4]
    }
}

// Building a dictionary with the combination of skill, day, startTime, and finishTime as keys and cost as values.
function buildShiftCostMap(table3) {
    const shiftCostMap = {};

    for (const line3 of table3) {
        const key = `${line3[0]}_${line3[1]}_${line3[2]}_${line3[3]}`; // Combine skill, day, startTime, and finishTime as the key
        shiftCostMap[key] = line3[4]; // Assign the cost as the value
    }

    return shiftCostMap;
}

// This function transforms the user's shiftTables data into a map
const transformShiftTablesToMap = async (shiftTables) => {
    const resultMap = new Map();
    // Iterate over each shift table in the user's data
    shiftTables.forEach(shiftTable => {
        const key = getKey(shiftTable.day, shiftTable.skill); // Form the key using day and skill
        if (!resultMap.has(key)) {
            resultMap.set(key, []); // Initialize an empty array for the key if it doesn't exist
        }
        // Push the shifts data into the array for the corresponding key
        const shiftsData = shiftTable.shifts.map(shift => ([
            shiftTable.day,
            shiftTable.skill,
            shift.startTime,
            shift.finishTime,
            shift.numOfWorkers,
            shift.cost,
            shift.id2
        ]));
        resultMap.get(key).push(...shiftsData);
    });
    return sortResults1Map(resultMap);
}

// This function transforms the user's shiftTables data into a map
const transformAssignedShiftTablesToMap = async (assignedShiftTables) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const resultMap = new Map();
    daysOfWeek.forEach(day => {
        resultMap.set(day, []);
    });
    // Iterate over each assgined shift table in the user's data
    assignedShiftTables.forEach(assignedShiftTable => {
        const key = assignedShiftTable.day
        if (!resultMap.has(key)) {
            resultMap.set(key, []); // Initialize an empty array for the key if it doesn't exist
        }
        // Push the assigned shifts data into the array for the corresponding key
        const assignedShiftsData = assignedShiftTable.assignedShifts.map(assignedShift => ([
            assignedShift.day,
            assignedShift.skill,
            assignedShift.startTime,
            assignedShift.finishTime,
            assignedShift.assignedWorkerName,
            assignedShift.shiftId - 1,
            assignedShift._id
        ]));
        resultMap.get(key).push(...assignedShiftsData);
    });
    return resultMap;
}

//This function transforms assignedShiftTables to a dictionary where the keys are realShiftId and the values are shiftId.
const transformAssignedShiftTablesToIdsDict = async (assignedShiftTables) => {
    const shiftDict = {};

    // Iterate over each assigned shift table in the user's data
    assignedShiftTables.forEach(assignedShiftTable => {
        // Iterate over each assigned shift within the assigned shift table
        assignedShiftTable.assignedShifts.forEach(assignedShift => {
            // Set the realShiftId as the key and shiftId as the value in the dictionary
            shiftDict[assignedShift.realShiftId] = assignedShift.shiftId;
        });
    });

    return shiftDict;
}


//This function creates the key in the used format.
function getKey(day, skill, req) {
    if (!req) {
        return (day).toLowerCase() + "*" + skill
    }

    return skill + "" + (day).toLowerCase()
}

//This functino returns the worker with the given ID. If there is no worker with that ID, it returns an empty string.
const getWorkerNameByWorkerId = async (table1, workerId) => {
    for (const line of table1) {
        if (line[0] === workerId) {
            return line[1]
        }
    }
    return ''
}

module.exports = {getEmployeesHoursWorkedDict, getAssignedLines, transformToShiftEmployeesMap, transformShiftTablesToArray, getWorkerNamesMapByUserId, getShiftCost, transformShiftTablesToMap, transformAssignedShiftTablesToMap, transformAssignedShiftTablesToIdsDict, getWorkerNameByWorkerId, buildShiftCostMap}