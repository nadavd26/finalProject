import "../css/TableRow.css"; // Import your CSS file for styling
import FreeEditCell from '../components/FreeEditCell';
import NonEditableCell from "../components/NonEditableCell";
import React from "react";
const TableRow = ({ row, isNumberOfWorkersValid, rowIndex, onCellEdit, shouldRender}) => {
    
    const cell = document.getElementById(`cell-${rowIndex}-${4}`)
    var cellValue = row[4]
    if (cell != null && cell.innerText != "") {
        cellValue = cell.innerText
    }
    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                <NonEditableCell value={row[0]} rowIndex={rowIndex} coloumnIndex={0}/>
                <NonEditableCell value={row[1]} rowIndex={rowIndex} columnIndex={1} />
                <NonEditableCell value={row[2]} rowIndex={rowIndex} columnIndex={2}  />
                <NonEditableCell value={row[3]} rowIndex={rowIndex} columnIndex={3}  />
                <FreeEditCell value={row[4]} rowIndex={rowIndex} columnIndex={4} isValid={isNumberOfWorkersValid(cellValue)} onEdit={onCellEdit}/>
                <NonEditableCell value={row[5]} rowIndex={rowIndex} columnIndex={5}  />
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

