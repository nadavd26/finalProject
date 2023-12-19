import "../css/TableRow.css"; // Import your CSS file for styling
import DayCell from './DayCell';
import FreeEditCell from './FreeEditCell';
import TimeCell from './TimeCell';
import RowActionCell from './RowActionCell';

export default function TableRow({ row, rowErrors, rowIndex, onCellEdit, onRowDelete, onRowAdd }) {
    const handleDeleteRow = () => {
        onRowDelete(rowIndex)
    }

    const handleAddRow = () => {
        onRowAdd(rowIndex)
    }

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


    console.log(row)

    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                {/* <td id="deleteRow" className='cell100 first-column static-position '>
                    <button className="border-0 p-0 no-outline" onClick={handleDeleteRow} id="deleteBtn">
                        <img src={rowDeleteImage} alt="Image" className="img-fluid" id="deleteImg" />
                    </button>
                </td> */}

                <RowActionCell onRowDelete={handleDeleteRow} onRowAdd={handleAddRow}/>

                <DayCell value={row[0]} rowIndex={rowIndex} coloumnIndex={0} isValid={rowErrors[0]} onEdit={onCellEdit} />

                <FreeEditCell value={row[1]} rowIndex={rowIndex} columnIndex={1} isValid={rowErrors[1]} onEdit={onCellEdit}/>

                <TimeCell value={row[2]} rowIndex={rowIndex} columnIndex={2} isValid={rowErrors[2]} minTime={minFromHour}
                    maxTime={maxFromHour} onEdit={onCellEdit} />

                <TimeCell value={row[3]} rowIndex={rowIndex} columnIndex={3} isValid={rowErrors[3]} minTime={minUntilHour}
                    maxTime={maxUntilHour} onEdit={onCellEdit} />

                <FreeEditCell value={row[4]} rowIndex={rowIndex} columnIndex={4} isValid={rowErrors[4]} onEdit={onCellEdit}/>

            </tr >
        </>
    );
}
