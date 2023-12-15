import rowDeleteImage from '../Images/deleteRow.png'
import "../css/TableRow.css"; // Import your CSS file for styling
import DayDropdown from './DayDropdown';

export default function TableRow({ row, rowIndex, onCellEdit, onRowDelete, onRowAdd, firstRow }) {
    var oldValue = ""
    const handleFocus = (index, value) => {
        oldValue = value
        document.getElementById(`cell-${rowIndex}-${index}`).classList.add("focused-cell");
    };

    const handleCellEdit = (columnIndex, value, e) => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.remove("focused-cell");
        onCellEdit(rowIndex, columnIndex, value);
    };

    const handleDayEdit = (day) => {
        onCellEdit(rowIndex, 0, day);
    }

    const handleTimeEdit = (columnIndex, id) => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.remove("focused-cell");
        var inputElement = document.getElementById(id);
        var inputValue = inputElement.value;
        onCellEdit(rowIndex, columnIndex, inputValue);
        // console.log(inputValue)
    };

    const handleDeleteRow = () => {
        onRowDelete(rowIndex)
    }

    const handleAddRow = () => {
        onRowAdd(rowIndex)
    }
    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                <td id="deleteRow" className='cell100 first-column static-position '>
                    <button className="border-0 p-0 no-outline" onClick={handleDeleteRow} id="deleteBtn">
                        <img src={rowDeleteImage} alt="Image" className="img-fluid" id="deleteImg" />
                    </button>
                </td>

                <td id={`cell-${rowIndex}-${0}`} class="cell100 second-column" onBlur={(e) => handleCellEdit(0, e.target.innerText, e)}
                    onFocus={(e) => handleFocus(0, e.target.innerText)}><DayDropdown firstDay={row.value[0]} dayHandler={handleDayEdit}/>
                </td>
                
                <td id={`cell-${rowIndex}-${1}`} class="cell100 last-columns " contenteditable="true" onBlur={(e) => handleCellEdit(1, e.target.innerText, e)}
                    onFocus={(e) => handleFocus(1, e.target.innerText)}>{row.value[1]}</td>
                
                <td id={`cell-${rowIndex}-${2}`} class="cell100 last-columns"  onBlur={(e) => handleTimeEdit(2, "appt1-" + rowIndex)}
                    onFocus={(e) => handleFocus(2, e.target.innerText)}>
                    <input type="time" id={`appt1-${rowIndex}`} name="appt" required /></td>
                
                <td id={`cell-${rowIndex}-${3}`} class="cell100 last-columns " onBlur={(e) => handleTimeEdit(3,  "appt2-" + rowIndex)}
                    onFocus={(e) => handleFocus(3, e.target.innerText)}>
                    <input type="time" id={`appt2-${rowIndex}`} name="appt" required />
                </td>
                
                <td id={`cell-${rowIndex}-${4}`} class="cell100 last-columns " contenteditable="true" onBlur={(e) => handleCellEdit(4, e.target.innerText, e)}
                    onFocus={(e) => handleFocus(4, e.target.innerText)}>{row.value[4]}</td>
            </tr >
        </>
    );
}
