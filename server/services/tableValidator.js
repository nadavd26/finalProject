const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

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
        if (line.length != 6 || line[0] == '' || line[1] == '' || line[2] == '' || line[5] == '')
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
        if(line[0] == '' || line[1] == '' || line[2] == '' || line[3] == '' || line[4] == '')
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
        if(line[0] == '' || line[1] == '' || line[2] == '' || line[3] == '' || line[4] == '')
            return false
    }
    return true;
}

// This function checks that all days and skills that are in table 3 are also in table 2.
const validateAlgoRequirements = (table2, table3) => {
    daysSet = new Set();
    skillsSet = new Set();
    for (line of table2) {
        daysSet.add(line[0])
        skillsSet.add(line[1])
    }
    for (line of table3) {
        if(!(daysSet.has(line[1]) && skillsSet.has(line[0])))
            return false
    }
    return true;
}

module.exports = { validateTable1, validateTable2, validateTable3, validateAlgoRequirements}