import rowDeleteImage from '../Images/deleteRow.png'
import rowAddImage from '../Images/addRow.png'
import "../css/TableRow.css"; // Import your CSS file for styling

export default function TableRow({ row, rowErrors, rowIndex, onCellEdit, onRowDelete }) {
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

    function adjustTime(timeString, addHalfHour = true) {
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

    var minFromHour = "00:00";
    var maxFromHour = rowErrors[3] ? "23:30" : adjustTime(row[3], false)
    var minUntilHour = rowErrors[2] ? "00:30" : adjustTime(row[2], true)
    var maxUntilHour = "24:00";

    const timeOptionsFrom = generateTimeOptions(minFromHour, maxFromHour);
    const arrayTimeOptionsFrom = generateArrayTimeOptions(minFromHour, maxFromHour)
    const arrayTimeOptionsUntil = generateArrayTimeOptions(minUntilHour, maxUntilHour)
    const timeOptionsUntil = generateTimeOptions(minUntilHour, maxUntilHour);

    console.log(row)

    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                <td id="deleteRow" className='cell100 first-column static-position' style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <button className="border-0 p-0 no-outline" onClick={handleDeleteRow} id="deleteBtn">
                            <img src={rowDeleteImage} alt="Delete Image" className="img-fluid" />
                        </button>
                        <button className="border-0 p-0 no-outline ml-2" onClick={handleDeleteRow} id="addBtn">
                            <img src={rowAddImage} alt="Add Image" className="img-fluid" />
                        </button>
                    </div>
                </td>
                <td id={`cell-${rowIndex}-${0}`} className={`cell100 second-column ${rowErrors[0] ? 'red' : ''}`} onBlur={(e) => handleOnBlur(0)} onFocus={(e) => handleFocus(0)}>
                    <select id={`selectDay-${rowIndex}`} value={row[0]} onChange={(e) => handleDayEdit(0, e.target.value)}>
                        {["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].includes(row[0]) ? (
                            <>
                                <option value="sunday">Sunday</option>
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                            </>
                        ) : (
                            <>
                                <option value={row[0]} hidden>{row[0]}</option>
                                <option value="sunday">Sunday</option>
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                            </>
                        )}
                    </select>
                </td>



                <td
                    id={`cell-${rowIndex}-${1}`}
                    className={`cell100 last-columns ${rowErrors[1] ? 'red' : ''}`}
                    contentEditable="true"
                    onBlur={(e) => handleSkillEdit(1, e.target.innerText, e)}
                    onFocus={(e) => handleFocus(1, e.target.innerText)}
                >
                    {row[1]}
                </td>


                <td id={`cell-${rowIndex}-${2}`} className={`cell100 last-columns ${rowErrors[2] ? 'red' : ''}`} onBlur={(e) => handleOnBlur(2)} onFocus={(e) => handleFocus(2)}>
                    <select id={`appt1-${rowIndex}`} name="appt" required value={row[2]} onChange={(e) => handleTimeEdit(2, e.target.value)}>
                        {arrayTimeOptionsFrom.includes(row[2]) ? (
                            <>
                                {timeOptionsFrom}
                            </>
                        ) : (
                            <>
                                <option value={row[2]} hidden>
                                    {row[2]}
                                </option>
                                {timeOptionsFrom}
                            </>
                        )}
                    </select>
                </td>


                <td id={`cell-${rowIndex}-${3}`} className={`cell100 last-columns ${rowErrors[3] ? 'red' : ''}`} onBlur={(e) => handleOnBlur(3)}
                    onFocus={(e) => handleFocus(3)}>
                    <select id={`appt2-${rowIndex}`} name="appt" required value={row[3]} onChange={(e) => handleTimeEdit(3, e.target.value)}>
                        {arrayTimeOptionsUntil.includes(row[3]) ? (
                            <>
                                {timeOptionsUntil}
                            </>
                        ) : (
                            <>
                                <option value={row[3]} hidden>
                                    {row[3]}
                                </option>
                                {timeOptionsUntil}
                            </>
                        )}
                    </select>
                </td>

                <td id={`cell-${rowIndex}-${4}`} className={`cell100 last-columns ${rowErrors[4] ? 'red' : ''}`} contenteditable="true" onBlur={(e) => handleNumberOfWorkersEdit(4, e.target.innerText, e)}
                    onFocus={(e) => handleFocus(4, e.target.innerText)}>{row[4]}</td>
            </tr >
        </>
    );
}
