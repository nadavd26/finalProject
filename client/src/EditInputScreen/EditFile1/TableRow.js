import "../css/TableRow.css"; // Import your CSS file for styling
import DayCell from '../components/DayCell';
import FreeEditCell from '../components/FreeEditCell';
import TimeCell from '../components/TimeCell';
import RowActionCell from '../components/RowActionCell';
import React from "react";
import { adjustTime } from "../Utils";
const TableRow = ({ row, rowErrors, rowIndex, onCellEdit, onRowDelete, onRowAdd, shouldRender, enableEdit }) => {
    const handleDeleteRow = () => {
        onRowDelete(rowIndex)
    }

    const handleAddRow = () => {
        onRowAdd(rowIndex)
    }

    return (
        <>
            <tr className="row100 body last-rows" id="table-row">

                <RowActionCell onRowDelete={handleDeleteRow} onRowAdd={handleAddRow} rowIndex={rowIndex} enableEdit={enableEdit}/>

                <FreeEditCell value={row[0]} rowIndex={rowIndex} columnIndex={0} isValid={rowErrors[0]} onEdit={onCellEdit} enableEdit={enableEdit}/>

                <FreeEditCell value={row[1]} rowIndex={rowIndex} columnIndex={1} isValid={rowErrors[1]} onEdit={onCellEdit} enableEdit={enableEdit}/>

                <FreeEditCell value={row[2]} rowIndex={rowIndex} columnIndex={2} isValid={rowErrors[2]} onEdit={onCellEdit} enableEdit={enableEdit}/>

                <FreeEditCell value={row[3]} rowIndex={rowIndex} columnIndex={3} isValid={rowErrors[3]} onEdit={onCellEdit} enableEdit={enableEdit}/>

                <FreeEditCell value={row[4]} rowIndex={rowIndex} columnIndex={4} isValid={rowErrors[4]} onEdit={onCellEdit} enableEdit={enableEdit}/>

                <FreeEditCell value={row[5]} rowIndex={rowIndex} columnIndex={5} isValid={rowErrors[5]} onEdit={onCellEdit} enableEdit={enableEdit}/>

                <FreeEditCell value={row[6]} rowIndex={rowIndex} columnIndex={6} isValid={rowErrors[6]} onEdit={onCellEdit} enableEdit={enableEdit}/>
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
