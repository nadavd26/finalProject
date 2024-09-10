export default function TimeCell({value, rowIndex, columnIndex, isValid, minTime, maxTime, onEdit, enableEdit}) {
    const generateArrayTimeOptions = (minHour, maxHour) => {
        const [minHourValue, minMinuteValue] = minHour.split(':').map(Number);
        const [maxHourValue, maxMinuteValue] = maxHour.split(':').map(Number);
        const timeOptions = [];
        if (minHour === maxHour) {
            timeOptions.push(minHour);
            return timeOptions
        }
        for (let hour = minHourValue; hour <= maxHourValue; hour++) {
            for (let minute = 0; minute <= 30; minute += 30) {
                if (
                    (hour === minHourValue && minute >= minMinuteValue) ||
                    (hour > minHourValue && hour < maxHourValue) ||
                    (hour === maxHourValue && minute <= maxMinuteValue)
                ) {
                    const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    timeOptions.push(formattedTime);
                }
            }
        }

        return timeOptions
    };

    const generateTimeOptions = (minHour, maxHour) => {
        const [minHourValue, minMinuteValue] = minHour.split(':').map(Number);
        const [maxHourValue, maxMinuteValue] = maxHour.split(':').map(Number);
        const timeOptions = [];
        if (minHour === maxHour) {
            timeOptions.push(<option value={minHour}>{minHour}</option>);
            return timeOptions
        }
        for (let hour = minHourValue; hour <= maxHourValue; hour++) {
            for (let minute = 0; minute <= 30; minute += 30) {
                if (
                    (hour === minHourValue && minute >= minMinuteValue) ||
                    (hour > minHourValue && hour < maxHourValue) ||
                    (hour === maxHourValue && minute <= maxMinuteValue)
                ) {
                    const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    timeOptions.push(<option value={formattedTime}>{formattedTime}</option>);
                }
            }
        }

        return timeOptions
    };

    const timeOptions = generateTimeOptions(minTime, maxTime)
    const arrayTimeOptions = generateArrayTimeOptions(minTime, maxTime)

    const handleOnBlur = () => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.remove("focused-cell");
    }

    const handleFocus = () => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.add("focused-cell");
    };
    
    return <td id={`cell-${rowIndex}-${columnIndex}`} className={`cell100 last-columns ${isValid ? 'red' : ''}`} onBlur={handleOnBlur} onFocus={handleFocus}>
        <select id={`appt1-${rowIndex}`} name="appt" required value={value} onChange={(e) => onEdit(rowIndex, columnIndex, e.target.value)} disabled={!enableEdit}>
            {arrayTimeOptions.includes(value) ? (
                <>
                    {timeOptions}
                </>
            ) : (
                <>
                    <option value={value} hidden>
                        {value}
                    </option>
                    {timeOptions}
                </>
            )}
        </select>
    </td>
}