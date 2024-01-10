const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
//The function is used to sort the table 2 array.
const customSort2 = (a, b) => {
    //In table 2 the first item of each row is a day.
    daysCompare = compareDays(a[0], b[0])
    if(daysCompare != 0)
        return daysCompare
    //The rest of the row items are simply compared as strings.
    for (i = 1; i < 5; i++)
        if (a[i] != b[i])
            return a[i].localeCompare(b[i])
    //If nothing has been returned yet the row are the same.
    return 0
}

//The function checks if the given argument is one of the days of the week(case insensetive)
const isDayOfWeek = (day) => {
    const lowerCaseDay = day.toLowerCase();
    return days.includes(lowerCaseDay);
}

//The function compares days of the week
const compareDays = (day1, day2) => {
    const index1 = days.indexOf(day1.toLowerCase());
    const index2 = days.indexOf(day2.toLowerCase());

    return index1 - index2;
}

module.exports = { customSort2 }