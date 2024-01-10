const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

//The function checks if the given argument is one of the days of the week(case insensetive)
const isDayOfWeek = (day) => {
    const lowerCaseDay = day.toLowerCase();
    return days.includes(lowerCaseDay);
}

//Checking that the string is actually a valid hour.
const isValidHourFormat = (timeString)  =>{
    const timeComponents = timeString.split(':');
    if (timeComponents.length !== 2) {
        return false; // Has to have exactly two components.
    }
    const hours = parseInt(timeComponents[0], 10);
    const minutes = parseInt(timeComponents[1], 10);

    if (isNaN(hours) || isNaN(minutes)) {
        return false; // Not valid integers for hours and minutes
    }

    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

const isNoneNegativeNumber = (number) => {
    const num = parseInt(number, 10);
    return num >= 0;
}

//This functions check that table is a valid table2.
const validateTable2 = (table) => {
    for (line of table) {
        if(line.length != 5)
        return false;
        if (!isDayOfWeek(line[0]))
            return false;
        if (!(isValidHourFormat(line[2]) && isValidHourFormat(line[3])))
            return false;
        if(!isNoneNegativeNumber(line[4]))
            return false;
    }
    return true;
}

module.exports = {validateTable2}