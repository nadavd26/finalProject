import rowDeleteImage from '../Images/deleteRow.png'
import "../css/TableRow.css"; // Import your CSS file for styling
import DayDropdown from './DayDropdown';

export default function TableRow({ row, rowIndex, onCellEdit, onRowDelete, onRowAdd, firstRow, isNumberOfWorkersValid, isSkillValid }) {
    const handleFocus = (index) => {
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

    const handleTimeEdit = (columnIndex, value) => {
        onCellEdit(rowIndex, columnIndex, value);
    };

    const handleDayEdit = (columnIndex, value) => {
        onCellEdit(rowIndex, columnIndex, value);
    };

    const handleOnBlur = (columnIndex) => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.remove("focused-cell");
    }

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

    var minFromHour = "00:00";
    var maxFromHour = adjustTime(row[3], false)
    var minUntilHour = adjustTime(row[2], true)
    var maxUntilHour = "24:00";

    const timeOptionsFrom = generateTimeOptions(minFromHour, maxFromHour);
    const timeOptionsUntil = generateTimeOptions(minUntilHour, maxUntilHour);

    if (row[4] == 150 && row[2] == "13:00") {
        console.log("-----------------------")
        console.log(row[2] + " " + row[3])
        console.log("-----------------------")
    }

    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                <td id="deleteRow" className='cell100 first-column static-position '>
                    <button className="border-0 p-0 no-outline" onClick={handleDeleteRow} id="deleteBtn">
                        <img src={rowDeleteImage} alt="Image" className="img-fluid" id="deleteImg" />
                    </button>
                </td>

                <td id={`cell-${rowIndex}-${0}`} class="cell100 second-column" onBlur={(e) => handleOnBlur(0)}
                    onFocus={(e) => handleFocus(0)}>
                    <select id={`selectDay-${rowIndex}`} value={row[0]} onChange={(e) => handleDayEdit(0, e.target.value)}>
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
                    className={`cell100 last-columns ${isSkillValid(row[1]) ? '' : 'red'}`}
                    contentEditable="true"
                    onBlur={(e) => handleSkillEdit(1, e.target.innerText, e)}
                    onFocus={(e) => handleFocus(1, e.target.innerText)}
                >
                    {row[1]}
                </td>


                <td id={`cell-${rowIndex}-${2}`} class="cell100 last-columns" onBlur={(e) => handleOnBlur(2)}
                    onFocus={(e) => handleFocus(2)}>
                    <select id={`appt1-${rowIndex}`} name="appt" required value={row[2]} onChange={(e) => handleTimeEdit(2, e.target.value)}>
                        {timeOptionsFrom}
                    </select></td>

                <td id={`cell-${rowIndex}-${3}`} class="cell100 last-columns " onBlur={(e) => handleOnBlur(3)}
                    onFocus={(e) => handleFocus(3)}>
                    <select id={`appt2-${rowIndex}`} name="appt" required value={row[3]} onChange={(e) => handleTimeEdit(3, e.target.value)}>
                        {timeOptionsUntil}
                    </select>
                </td>

                <td id={`cell-${rowIndex}-${4}`} className={`cell100 last-columns ${isNumberOfWorkersValid(row[4]) ? '' : 'red'}`} contenteditable="true" onBlur={(e) => handleNumberOfWorkersEdit(4, e.target.innerText, e)}
                    onFocus={(e) => handleFocus(4, e.target.innerText)}>{row[4]}</td>
            </tr >
        </>
    );
}
