const User = require("../models/user");
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

module.exports = { validateTable1, validateTable2, validateTable3, validateTable2SkillsInTable3, validateTable3SkillsInTable2, validateTable2NumOfWorkers, validateTable1Algo1, validateTable3SkillsInTable1, validateTable2SkillsInTable1, validateTable1SkillsInTable3, validateTable1SkillsInTable2, getTableBit, setTableBit, validateTable2NumOfWorkersWithSkill }