import "../css/TableRow.css"; // Import your CSS file for styling
import FreeEditCell from '../components/FreeEditCell';
import NonEditableCell from "../components/NonEditableCell";
import React from "react";
const TableRow = ({ row, isNumberOfWorkersValid, rowIndex, onCellEdit, shouldRender}) => {
    // console.log("row " + (rowIndex + 1) +" is rendererd" + " " + row)
    const cell = document.getElementById(`cell-${rowIndex}-${4}`)
    var cellValue = row[4]
    if (cell != null && cell.innerText != "") {
        cellValue = cell.innerText
    }
    // console.log("cellValue")
    // console.log(cellValue)

    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                <NonEditableCell value={row[0]} rowIndex={rowIndex} coloumnIndex={0}/>
                <NonEditableCell value={row[1]} rowIndex={rowIndex} columnIndex={1} />
                <NonEditableCell value={row[2]} rowIndex={rowIndex} columnIndex={2}  />
                <NonEditableCell value={row[3]} rowIndex={rowIndex} columnIndex={3}  />
                <FreeEditCell value={row[4]} rowIndex={rowIndex} columnIndex={4} isValid={isNumberOfWorkersValid(cellValue)} onEdit={onCellEdit}/>
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

