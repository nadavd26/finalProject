export function csvToArray(data, delimiter = ',', omitFirstRow = false) {
    try {
        const lines = data.split('\n');
        const startFrom = omitFirstRow ? 1 : 0;
        const result = [];
        for (let i = startFrom; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.length === 0) {
                continue; // Skip empty lines
            }
            const values = line.split(delimiter);
            result.push(values);
        }
        return result;
    } catch (error) {
        throw new Error(`Error converting CSV to array: ${error.message}`);
    }
}

export function parseTime(inputTime) {
    console.log("input time: " + inputTime)
    const trimmedTime = inputTime.trim();
    if (trimmedTime === "24:00") {
        return trimmedTime
    }
    const timeComponents = trimmedTime.split(':');
    let hours, minutes;
    if (timeComponents.length === 2) {
        hours = parseInt(timeComponents[0]);
        minutes = parseInt(timeComponents[1]);
    } else if (timeComponents.length === 1 && trimmedTime.length >= 3) {
        hours = 0;
        minutes = parseInt(timeComponents[0]);
    } else {
        return null
    }
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return null
    }
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
}

export function isNumberOfWorkersValid(numOfWorkers){
    if (numOfWorkers === "") {
        return false
    }
    const parsedValue = Number(numOfWorkers);
    return Number.isInteger(parsedValue) && parsedValue >= 0;
};

export function isSkillValid(input) {
    console.log("input : " + input)
    const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9@'",.!? ]*$/;
    return regex.test(input);
}

export function adjustTime(timeString, addHalfHour = true) {
    if (timeString === "23:30" && addHalfHour) {
        return "24:00"
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes;
    totalMinutes += addHalfHour ? 30 : -30;
    totalMinutes = (totalMinutes + 1440) % 1440;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    const resultTimeString = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    return resultTimeString;
}