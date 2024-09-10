const User = require("../models/user");
const ResultsHelper = require("./resultsHelperFuncs")
const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const bitFields = {
    1: 'table1Bit',
    2: 'table2Bit',
    3: 'table3Bit',
    4: 'shiftTablesBit'
};

//The function checks if the given argument is one of the days of the week(case insensetive)
const isDayOfWeek = (day) => {
    const lowerCaseDay = day.toLowerCase();
    return days.includes(lowerCaseDay);
}

//Checking that the string is actually a valid hour.
const isValidHourFormat = (timeString) => {
    const timeComponents = timeString.split(':');
    if (timeComponents.length !== 2) {
        return false; // Has to have exactly two components.
    }
    const hours = parseInt(timeComponents[0], 10);
    const minutes = parseInt(timeComponents[1], 10);

    if (isNaN(hours) || isNaN(minutes)) {
        return false; // Not valid integers for hours and minutes
    }

    return hours >= 0 && hours <= 24 && minutes >= 0 && minutes <= 59;
}

const isNoneNegativeNumber = (number) => {
    const num = parseInt(number, 10);
    return num >= 0;
}

//This functions checks that table is a valid table1.
const validateTable1 = (table) => {
    for (line of table) {
        if (line.length != 7 || line[0] == '' || line[1] == '' || line[2] == '')
            return false;
    }
    return true;
}

//This functions checks that table is a valid table2.
const validateTable2 = (table) => {
    for (line of table) {
        if (line.length != 5)
            return false;
        if (!isDayOfWeek(line[0]))
            return false;
        if (!(isValidHourFormat(line[2]) && isValidHourFormat(line[3])))
            return false;
        if (!isNoneNegativeNumber(line[4]))
            return false;
        if (line[0] == '' || line[1] == '' || line[2] == '' || line[3] == '' || line[4] == '')
            return false
    }
    return true;
}

//This functions checks that table is a valid table3.
const validateTable3 = (table) => {
    for (line of table) {
        if (line.length != 5)
            return false;
        if (!isDayOfWeek(line[1]))
            return false;
        if (!(isValidHourFormat(line[2]) && isValidHourFormat(line[3])))
            return false;
        if (!isNoneNegativeNumber(line[4]))
            return false;
        if (line[0] == '' || line[1] == '' || line[2] == '' || line[3] == '' || line[4] == '')
            return false
    }
    return true;
}

// This function checks that all the skills that are in table 3 are also in table 2.
const validateTable3SkillsInTable2 = (table2, table3) => {
    info = [true, "The following skills are in table 3 but not in table 2: "]
    skillsSet = new Set();
    for (const line of table2) {
        skillsSet.add(line[1])
    }
    let counter = 0
    for (const line of table3) {
        if (!skillsSet.has(line[0])) {
            if (info[0]) {
                info[0] = false
                info[1] += line[0]
                skillsSet.add(line[0]) // We do not want to write the same skill more than once so we just add it to the set.
                counter++
            } else {
                info[1] += ", " + line[0]
                skillsSet.add(line[0])
                counter++
                if (counter == 5) {   // We dont want to inform about more than five at a time.
                    info[1] += "..."
                    return info
                }
            }
        }
    }
    return info;
}

// This function checks that all the skills that are in table 3 are also in table 1.
const validateTable3SkillsInTable1 = (table1, table3) => {
    info = [true, "The following skills are in table 3 but not in table 1: "]
    skillsSet = new Set();
    for (const line of table1) {
        if (line[2] != "")
            skillsSet.add(line[2])
        if (line[3] != "")
            skillsSet.add(line[3])
        if (line[4] != "")
            skillsSet.add(line[4])
    }
    let counter = 0
    for (const line of table3) {
        if (!skillsSet.has(line[0])) {
            if (info[0]) {
                info[0] = false
                info[1] += line[0]
                skillsSet.add(line[0])
                counter++
            } else {
                info[1] += ", " + line[0]
                skillsSet.add(line[0])
                counter++
                if (counter == 5) {   // We dont want to inform about more than five at a time.
                    info[1] += "..."
                    return info
                }
            }
        }
    }
    return info;
}

// This function checks that all the skills that are in table 2 are also in table 1.
const validateTable2SkillsInTable1 = (table1, table2) => {
    info = [true, "The following skills are in table 2 but not in table 1: "]
    skillsSet = new Set();
    for (const line of table1) {
        if (line[2] != "")
            skillsSet.add(line[2])
        if (line[3] != "")
            skillsSet.add(line[3])
        if (line[4] != "")
            skillsSet.add(line[4])
    }
    let counter = 0
    for (const line of table2) {
        if (!skillsSet.has(line[1])) {
            if (info[0]) {
                info[0] = false
                info[1] += line[1]
                skillsSet.add(line[1])
                counter++
            } else {
                info[1] += ", " + line[1]
                skillsSet.add(line[1])
                counter++
                if (counter == 5) {   // We dont want to inform about more than five at a time.
                    info[1] += "..."
                    return info
                }
            }
        }
    }
    return info;
}

// This function checks that all the workers in table 1 has a skill that is in the table 3.
const validateTable1SkillsInTable3 = (table1, table3) => {
    info = [true, "The following workers do not have skills in table3: "
        , true, "The following workers have a skill that is not in table3: "]
    skillsSet = new Set();
    for (const line of table3) {
        skillsSet.add(line[0])
    }
    let counter1 = 0
    let counter2 = 0
    for (const line of table1) {
        if (!skillsSet.has(line[2]) && !skillsSet.has(line[3]) && !skillsSet.has(line[4])) {
            if (info[0]) {
                info[0] = false
                info[1] += line[0]
                counter1++
            } else {
                info[1] += ", " + line[0]
                counter1++
                if (counter1 == 5) {   // We dont want to inform about more than five at a time.
                    info[1] += "..."
                    return info
                }
            }
            // We also want to give a warning about workes that have skills that are not in table3.
        } else if (!skillsSet.has(line[2]) || (!skillsSet.has(line[3]) && line[3] != "") || (!skillsSet.has(line[4]) && line[4] != "")) {
            if (info[2]) {
                info[2] = false
                info[3] += line[0]
                counter2++
            } else {
                info[3] += ", " + line[0]
                counter2++
                if (counter2 == 5) {   // We dont want to inform about more than five at a time.
                    info[3] += "..."
                    return info
                }
            }
        }
    }
    return info;
}

// This function checks that all the workers in table 1 has a skill that is in the table 2.
const validateTable1SkillsInTable2 = (table1, table2) => {
    info = [true, "The following workers do not have skills in table2: "
        , true, "The following workers have a skill that is not in table2: "]
    skillsSet = new Set();
    for (const line of table2) {
        skillsSet.add(line[1])
    }
    let counter1 = 0
    let counter2 = 0
    for (const line of table1) {
        if (!skillsSet.has(line[2]) && !skillsSet.has(line[3]) && !skillsSet.has(line[4])) {
            if (info[0]) {
                info[0] = false
                info[1] += line[0]
                counter1++
            } else {
                info[1] += ", " + line[0]
                counter1++
                if (counter1 == 5) {   // We dont want to inform about more than five at a time.
                    info[1] += "..."
                    return info
                }
            }
            // We also want to give a warning about workes that have skills that are not in table2.
        } else if (!skillsSet.has(line[2]) || (!skillsSet.has(line[3]) && line[3] != "") || (!skillsSet.has(line[4]) && line[4] != "")) {
            if (info[2]) {
                info[2] = false
                info[3] += line[0]
                counter2++
            } else {
                info[3] += ", " + line[0]
                counter2++
                if (counter2 == 5) {   // We dont want to inform about more than five at a time.
                    info[3] += "..."
                    return info
                }
            }
        }
    }
    return info;
}

// This function checks that all the skills that are in table 2 are also in table 3.
const validateTable2SkillsInTable3 = (table2, table3) => {
    info = [true, "The following skills are in table 2 but not in table 3: "]
    skillsSet = new Set();
    for (const line of table3) {
        skillsSet.add(line[0])
    }
    let counter = 0
    for (const line of table2) {
        if (!skillsSet.has(line[1])) {
            if (info[0]) {
                info[0] = false
                info[1] += line[1]
                skillsSet.add(line[1])
                counter++
            } else {
                info[1] += ", " + line[1]
                skillsSet.add(line[1])
                counter++
                if (counter == 5) {   // We dont want to inform about more than five at a time.
                    info[1] += "..."
                    return info
                }
            }
        }
    }
    return info;
}

// This function checks that the requiredNumOfWorkers of every 
// line in table2 is not more than the actual number of workers. 
const validateTable2NumOfWorkers = (table1, table2) => {
    info = [true, "The following lines in Table2 have a required number of workers value higher than the actual number of workers: "]
    const numOfWorkers = table1.length
    lineIndex = 1
    let counter = 0
    for (const line of table2) {
        if (Number(line[4]) > numOfWorkers) {
            if (info[0]) {
                info[0] = false
                info[1] += String(lineIndex)
                counter++
            } else {
                info[1] += ", " + String(lineIndex)
                counter++
                if (counter == 5) {   // We dont want to inform about more than five at a time.
                    info[1] += "..."
                    return info
                }
            }
        }
        lineIndex++
    }
    return info;
}

// This function checks that the requiredNumOfWorkers of every 
// line in table2 is not more than the actual number of workers with that skill. 
const validateTable2NumOfWorkersWithSkill = (table1, table2) => {
    info = [true, "The following lines in Table2 have a required number of workers value higher than the actual number of workers with that skill: "]
    lineIndex = 1
    let counter = 0
    for (const line of table2) {
        const numOfWorkers = numOfWorkersWithSkill(table1, line[1])
        if (Number(line[4]) > numOfWorkers) {
            if (info[0]) {
                info[0] = false
                info[1] += String(lineIndex)
                counter++
            } else {
                info[1] += ", " + String(lineIndex)
                counter++
                if (counter == 5) {   // We dont want to inform about more than five at a time.
                    info[1] += "..."
                    return info
                }
            }
        }
        lineIndex++
    }
    return info;
}

const numOfWorkersWithSkill = (table1, skill) => {
    let counter = 0
    table1.forEach(element => {
        if(skill == element[2] || skill == element[3] || skill == element[4]) {
            counter++
        }
    });
    return counter
}

const numOfWorkersNeededWithSkill = (arr) => {
    let max = -1;
    arr.forEach(element => {
        if(max < Number(element[4]))
            max = Number(element[4])
    })
    return max
}

//This function checks that in each pair of day and skill, the amount of workes is 
//not more than the actual amount of workers that are in Table1.
const validateTable1Algo1 = (table1, resultsMap) => {
    info = [true, "In the following pairs of days and skills there is a line with an amount of workers greater than the actual amount of workers with that skill : "]
    let counter = 0
    for (const [key, value] of resultsMap.entries()) {
        for (const line of value) {
            const numOfWorkers = numOfWorkersWithSkill(table1, line[1])
            if (Number(line[4]) > numOfWorkers) {
                counter++
                if (info[0]) {
                    info[0] = false
                    info[1] += "(" + key.replace("*", ", ") + ") : " + numOfWorkersNeededWithSkill(value) + " workers with this skill needed"  //Replacing the '*' that sepreates the day and skill in the map.
                    break                                           //We want to add each pair only once.
                } else {
                    info[1] += ", " + "(" + key.replace("*", ", ") + ")  : " + numOfWorkersNeededWithSkill(value) + " workers with this skill needed"
                    break
                }
            }
        }
        if (counter == 5) {   // We dont want to inform about more than five at a time.
            info[1] += "..."
            return info
        }
    }
    return info
}

//This function returns the value of the bit of the given table index(shiftsTable is 4).
const getTableBit = async (userId, tableNumber) => {
    const bitField = bitFields[tableNumber];
    if (!bitField) {
        throw new Error('Invalid table number: ' + tableNumber + '. Must be between 1 and 4.');
    }
    try {
        const user = await User.findById(userId).select(bitField);
        if (!user) {
            throw new Error("User not found");
        }
        return user[bitField];
    } catch (error) {
        throw error;
    }
}

const setTableBit = async (userId, tableNumber, newValue) => {
    const bitField = bitFields[tableNumber];
    if (!bitField) {
        throw new Error('Invalid table number: ' + tableNumber + '. Must be between 1 and 4.');
    }
    try {
        const update = {};
        update[bitField] = newValue;
        const result = await User.findByIdAndUpdate(
            userId,
            update,
            { new: true } // Return the updated document
        );
        if (!result) {
            throw new Error("User not found");
        }
        return result;
    } catch (error) {
        throw error;
    }
};

const checkResults2 = async (userId) => {
    const user = await User.findById(userId).populate('table1').populate('shiftTables.shifts').populate('assignedShiftTables.assignedShifts');
    const employeeHoursWorked = await ResultsHelper.getEmployeesHoursWorkedDict(userId)
    const table1 = user['table1'] || [];
    const results2 = ResultsHelper.getAssignedLines(user.assignedShiftTables)
    const transformedResults2 = ResultsHelper.transformToShiftEmployeesMap(results2)
    const results1 = ResultsHelper.transformShiftTablesToArray(user.shiftTables)
    //Check min_hours
    info1 = [true, "The following employees work less hour than required in their contracts: "]
    let counter = 0
    for (const line1 of table1) {
        const minHours = line1['min_hours'] === null ? 0 : line1['min_hours'] //this value might be null, in this case we'll consider it as 0: no value will be less than that.
        if (employeeHoursWorked[line1['id']] < minHours) {
            if (info1[0]) {
                info1[0] = false
                info1[1] += String(line1['id'])
            } else {
                info1[1] += ', ' + String(line1['id'])
            }
            counter++
            if (counter == 5) {   // We dont want to inform about more than five at a time.
                info1[1] += "..."
                break
            }
        }
    }
    console.log(info1)
    info2 = [true, "The following employees work more hour than required in their contracts: "]
    counter = 0
    for (const line1 of table1) {
        const maxHours = line1['max_hours'] === null ? Number.MAX_SAFE_INTEGER : line1['max_hours'] //this value might be null, in this case we'll consider it as MAX_SAFE_INTEGER : no value will be greater than that.
        if (employeeHoursWorked[line1['id']] > maxHours) {
            if (info2[0]) {
                info2[0] = false
                info2[1] += String(line1['id'])
            } else {
                info2[1] += ', ' + String(line1['id'])
            }
            counter++
            if (counter == 5) {   // We dont want to inform about more than five at a time.
                info2[1] += "..."
                break
            }
        }
    }
    console.log(info2)
    info3 = [true, "The following shfits have less workers than required: "]
    counter = 0
    for (const line1 of results1) {
        if ((transformedResults2.get(line1['id'])).length < line1['required_workers']) {
            if (info3[0]) {
                info3[0] = false
                info3[1] += String(line1['id'])
            } else {
                info3[1] += ', ' + String(line1['id'])
            }
            counter++
            if (counter == 5) {   // We dont want to inform about more than five at a time.
                info3[1] += "..."
                break
            }
        }
    }
    console.log(info3)
}

//This function checks if there are workers that work less hours than what's required in their contracts.
const validateAlgo2MinHours = async (userId) => {
    const user = await User.findById(userId).populate('table1').populate('shiftTables.shifts').populate('assignedShiftTables.assignedShifts');
    const table1 = user['table1'] || [];
    const employeeHoursWorked = await ResultsHelper.getEmployeesHoursWorkedDict(userId, table1)
    info = [true, "The following employees work less hours than required in their contracts: "]
    let counter = 0
    for (const line1 of table1) {
        const minHours = line1['min_hours'] === null ? 0 : line1['min_hours'] //this value might be null, in this case we'll consider it as 0: no value will be less than that.
        if (employeeHoursWorked[line1['id']] < minHours) {
            if (info[0]) {
                info[0] = false
                info[1] += String(line1['id'])
            } else {
                info[1] += ', ' + String(line1['id'])
            }
            counter++
            if (counter == 5) {   // We dont want to inform about more than five at a time.
                info[1] += "..."
                return info
            }
        }
    }
    return info
}

//This function checks if there are workers that work more hours than the limit in their contracts.
const validateAlgo2MaxHours = async (userId) => {
    const user = await User.findById(userId).populate('table1').populate('shiftTables.shifts').populate('assignedShiftTables.assignedShifts');
    const table1 = user['table1'] || [];
    const employeeHoursWorked = await ResultsHelper.getEmployeesHoursWorkedDict(userId, table1)
    info = [true, "The following employees work more hours than the limit in their contracts: "]
    let counter = 0
    for (const line1 of table1) {
        const maxHours = line1['max_hours'] === null ? Number.MAX_SAFE_INTEGER : line1['max_hours'] //this value might be null, in this case we'll consider it as MAX_SAFE_INTEGER : no value will be greater than that.
        if (employeeHoursWorked[line1['id']] > maxHours) {
            if (info[0]) {
                info[0] = false
                info[1] += String(line1['id'])
            } else {
                info[1] += ', ' + String(line1['id'])
            }
            counter++
            if (counter == 5) {   // We dont want to inform about more than five at a time.
                info[1] += "..."
                return info
            }
        }
    }
    return info
}

//This function checks whether there are shifts that have less workers than their required workers field.
const validateAlgo2ShiftWorkersRequirement = async (userId) => {
    const user = await User.findById(userId).populate('table1').populate('shiftTables.shifts').populate('assignedShiftTables.assignedShifts');
    const results2 = ResultsHelper.getAssignedLines(user.assignedShiftTables)
    const transformedResults2 = ResultsHelper.transformToShiftEmployeesMap(results2)
    const results1 = ResultsHelper.transformShiftTablesToArray(user.shiftTables)
    info = [true, "The following shfits have less workers than required: "]
    counter = 0
    const idsDict = await ResultsHelper.transformAssignedShiftTablesToIdsDict(user.assignedShiftTables)
    for (const line1 of results1) {
        const assignedWorkers = transformedResults2.get(line1['id']) || []; 
        if (assignedWorkers.length < line1['required_workers']) {
            if (info[0]) {
                info[0] = false
                info[1] += idsDict[String(line1['id'])]
            } else {
                info[1] += ', ' + idsDict[String(line1['id'])]
            }
            counter++
            if (counter == 5) {   // We dont want to inform about more than five at a time.
                info[1] += "..."
                return info
            }
        }
    }
    return info
}

module.exports = { validateTable1, validateTable2, validateTable3, validateTable2SkillsInTable3, validateTable3SkillsInTable2, validateTable2NumOfWorkers, validateTable1Algo1, validateTable3SkillsInTable1, validateTable2SkillsInTable1, validateTable1SkillsInTable3, validateTable1SkillsInTable2, getTableBit, setTableBit, validateTable2NumOfWorkersWithSkill, validateAlgo2MinHours, validateAlgo2MaxHours, validateAlgo2ShiftWorkersRequirement }