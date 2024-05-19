import "../css/TableRow.css"; // Import your CSS file for styling
import DayCell from '../components/DayCell';
import FreeEditCell from '../components/FreeEditCell';
import TimeCell from '../components/TimeCell';
import RowActionCell from '../components/RowActionCell';
import React from "react";
import { adjustTime } from "../Utils";
const TableRow = ({ row, rowErrors, rowIndex, onCellEdit, onRowDelete, onRowAdd, shouldRender }) => {
    console.log("render worker num " + row[0])
    const handleDeleteRow = () => {
        onRowDelete(rowIndex)
    }

    const handleAddRow = () => {
        onRowAdd(rowIndex)
    }



    var minFromHour = "00:00";
    var maxFromHour = rowErrors[3] ? "23:30" : adjustTime(row[3], false)
    var minUntilHour = rowErrors[2] ? "00:30" : adjustTime(row[2], true)
    var maxUntilHour = "24:00";



    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                {/* <td id="deleteRow" className='cell100 first-column static-position '>
                    <button className="border-0 p-0 no-outline" onClick={handleDeleteRow} id="deleteBtn">
                        <img src={rowDeleteImage} alt="Image" className="img-fluid" id="deleteImg" />
                    </button>
                </td> */}

                <RowActionCell onRowDelete={handleDeleteRow} onRowAdd={handleAddRow} rowIndex={rowIndex}/>

                <FreeEditCell value={row[0]} rowIndex={rowIndex} columnIndex={0} isValid={rowErrors[0]} onEdit={onCellEdit} />

                <FreeEditCell value={row[1]} rowIndex={rowIndex} columnIndex={1} isValid={rowErrors[1]} onEdit={onCellEdit}/>

                <FreeEditCell value={row[2]} rowIndex={rowIndex} columnIndex={2} isValid={rowErrors[2]} onEdit={onCellEdit}/>

                <FreeEditCell value={row[3]} rowIndex={rowIndex} columnIndex={3} isValid={rowErrors[3]} onEdit={onCellEdit}/>

                <FreeEditCell value={row[4]} rowIndex={rowIndex} columnIndex={4} isValid={rowErrors[4]} onEdit={onCellEdit}/>

                <FreeEditCell value={row[5]} rowIndex={rowIndex} columnIndex={5} isValid={rowErrors[5]} onEdit={onCellEdit}/>

                <FreeEditCell value={row[6]} rowIndex={rowIndex} columnIndex={6} isValid={rowErrors[6]} onEdit={onCellEdit}/>
            </tr >
        </>
    );
}

function arePropsEqual(oldProps, newProps) {
    if (newProps.shouldRender) {
        return false
    }
    return true
}

const TableRowMemo = React.memo(TableRow, arePropsEqual)
export default TableRowMemo
