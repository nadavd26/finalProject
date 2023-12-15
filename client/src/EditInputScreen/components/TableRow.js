import rowDeleteImage from '../Images/deleteRow.png'
import "../css/TableRow.css"; // Import your CSS file for styling
import DayDropdown from './DayDropdown';

export default function TableRow({ row, rowIndex, onCellEdit, onRowDelete, onRowAdd, firstRow, isNumberOfWorkersValid, isSkillValid }) {
    var oldValue = ""
    const handleFocus = (index, value) => {
        oldValue = value
        document.getElementById(`cell-${rowIndex}-${index}`).classList.add("focused-cell");
    };

    const handleNumberOfWorkersEdit = (columnIndex, value, e) => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.remove("focused-cell");
        onCellEdit(rowIndex, columnIndex, value);
    };

    const handleSkillEdit = (columnIndex, value, e) => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.remove("focused-cell");
        onCellEdit(rowIndex, columnIndex, value);
    };

    const handleTimeEdit = (columnIndex, id) => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.remove("focused-cell");
        var inputElement = document.getElementById(id);
        var inputValue = inputElement.value;
        onCellEdit(rowIndex, columnIndex, inputValue);
        // console.log(inputValue)
    };

    const handleDayEdit = (columnIndex, id) => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.remove("focused-cell");
        var inputElement = document.getElementById(id);
        var inputValue = inputElement.value;
        onCellEdit(rowIndex, columnIndex, inputValue);
        console.log(inputValue)
    };

    const handleDeleteRow = () => {
        onRowDelete(rowIndex)
    }

    const handleAddRow = () => {
        onRowAdd(rowIndex)
    }

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

    function adjustTime(timeString, addHalfHour = true) {
        const [hours, minutes] = timeString.split(':').map(Number);
        let totalMinutes = hours * 60 + minutes;
        totalMinutes += addHalfHour ? 30 : -30;
        totalMinutes = (totalMinutes + 1440) % 1440;
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        const resultTimeString = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
        return resultTimeString;
    }

    var minFromHour = "06:00";
    var maxFromHour = "22:30";
    var minUntilHour = "06:30";
    var maxUntilHour = "23:00";

    var fromElement = document.getElementById("appt1-" + rowIndex);
    if (fromElement) {
        var fromValue = fromElement.value;
        if (fromValue !== "") {
            minUntilHour = adjustTime(fromValue);
            if (minUntilHour >= 0) {
                maxFromHour = adjustTime(minUntilHour, false);
            }
        }
    }

    var untilElement = document.getElementById("appt2-" + rowIndex);
    if (untilElement) {
        var untilValue = untilElement.value;
        if (untilValue !== "") {
            maxFromHour = adjustTime(untilValue, false);
            if (maxFromHour >= 0) {
                minUntilHour = adjustTime(maxFromHour);
            }
        }
    }

    const timeOptionsFrom = generateTimeOptions(minFromHour, maxFromHour);
    const timeOptionsUntil = generateTimeOptions(minUntilHour, maxUntilHour);



    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                <td id="deleteRow" className='cell100 first-column static-position '>
                    <button className="border-0 p-0 no-outline" onClick={handleDeleteRow} id="deleteBtn">
                        <img src={rowDeleteImage} alt="Image" className="img-fluid" id="deleteImg" />
                    </button>
                </td>

                <td id={`cell-${rowIndex}-${0}`} class="cell100 second-column" onBlur={(e) => handleDayEdit(0, "selectDay-" + rowIndex)}
                    onFocus={(e) => handleFocus(0, e.target.innerText)}>
                    <select id={`selectDay-${rowIndex}`}>
                        <option value="sunday">Sunday</option>
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                    </select>
                </td>

                <td
                    id={`cell-${rowIndex}-${1}`}
                    className={`cell100 last-columns ${isSkillValid(row.value[1]) ? '' : 'red'}`}
                    contentEditable="true"
                    onBlur={(e) => handleSkillEdit(1, e.target.innerText, e)}
                    onFocus={(e) => handleFocus(1, e.target.innerText)}
                >
                    {row.value[1]}
                </td>


                <td id={`cell-${rowIndex}-${2}`} class="cell100 last-columns" onBlur={(e) => handleTimeEdit(2, "appt1-" + rowIndex)}
                    onFocus={(e) => handleFocus(2, e.target.innerText)}>
                    <select id={`appt1-${rowIndex}`} name="appt" required defaultValue="06:00">
                        {timeOptionsFrom}
                    </select></td>

                <td id={`cell-${rowIndex}-${3}`} class="cell100 last-columns " onBlur={(e) => handleTimeEdit(3, "appt2-" + rowIndex)}
                    onFocus={(e) => handleFocus(3, e.target.innerText)}>
                    <select id={`appt2-${rowIndex}`} name="appt" required defaultValue="23:00">
                        {timeOptionsUntil}
                    </select>
                </td>

                <td id={`cell-${rowIndex}-${4}`} className={`cell100 last-columns ${isNumberOfWorkersValid(row.value[4]) ? '' : 'red'}`} contenteditable="true" onBlur={(e) => handleNumberOfWorkersEdit(4, e.target.innerText, e)}
                    onFocus={(e) => handleFocus(4, e.target.innerText)}>{row.value[4]}</td>
            </tr >
        </>
    );
}
