const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
//The function is used to sort the table 1 array.
const customSort1 = (a, b) => {
     //Id is the most significant element in the sorting of table1.
    if(a[0] != b[0])
        return a[0].localeCompare(b[0])
    //after that the skills are given the most significance in the table 1 sorting.
    for (i = 2; i < 5; i++)
        if (a[i] != b[i])
            return a[i].localeCompare(b[i])
    //After the skills the names is most significant
    if (a[1] != b[1])
            return a[1].localeCompare(b[1])
    //And lastley is the contract
    if (a[5] != b[5])
            return a[5].localeCompare(b[5])
    //If nothing has been returned yet the row are the same.
    return 0
}

//The function is used to sort the table 2 array.
const customSort2 = (a, b) => {
    //In table 2 the first item of each row is a day.
    daysCompare = compareDays(a[0], b[0])
    if(daysCompare != 0)
        return daysCompare
    //The rest of the row items discluding the last one are simply compared as strings.
    for (i = 1; i < 4; i++)
        if (a[i] != b[i])
            return a[i].localeCompare(b[i])
    //The last parameter is a number.
    if(a[4] != b[4])
        return a[i] - b[i]
    //If nothing has been returned yet the row are the same.
    return 0
}

//The function is used to sort the table 3 array.
const customSort3 = (a, b) => {
    //First we sort by day.
    daysCompare = compareDays(a[1], b[1])
    if(daysCompare != 0)
        return daysCompare
    //Then by 'from' an 'until'.
    for (i = 2; i < 4; i++)
        if (a[i] != b[i])
            return a[i].localeCompare(b[i])
    //Then by skill.
    if (a[0] != b[0])
            return a[0].localeCompare(b[0])
    //And at the end by cost.
    if(a[4] != b[4])
        return a[i] - b[i]
    //If nothing has been returned yet the row are the same.
    return 0
}

//Compares the skills which are strings but always puts empty string last.
const compareTable1Line = (a, b) => {
    if (a === "" && b === "") {
        return 0; // Both are empty string meaning taey are equal.
    } else if (a === "") {
        return 1; // Only first one is empty.
    } else if (b === "") {
        return -1; // Only second one is empty, 
    } else {
        return a.localeCompare(b); // the regular lexicographic comparison for non-empty strings.
    }
};

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

module.exports = {customSort1, customSort2, customSort3, compareTable1Line }