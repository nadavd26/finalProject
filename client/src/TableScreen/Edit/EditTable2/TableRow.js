import "../css/TableRow.css"; // Import your CSS file for styling
import FreeEditCell from '../components/FreeEditCell';
import NonEditableCell from "../components/NonEditableCell";
import WorkerDropdown from "../components/WorkerDropdown";
import ActionCell from "../components/ActionCell";
import * as utils from '../../Utils'
import { useState } from "react";
export default function TableRow({rowIndex,row,color,workerMap,shiftsInfo, generateWorkerList, onCellEdit}) {
    //TODO make useMemo
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                <ActionCell rowIndex={rowIndex} color={color}></ActionCell>
                <NonEditableCell value={row[0]} rowIndex={rowIndex} coloumnIndex={0} color={color} additionalClass={"no-left"} />
                <NonEditableCell value={row[1]} rowIndex={rowIndex} columnIndex={1} color={color} additionalClass={"no-left"} />
                <NonEditableCell value={row[2]} rowIndex={rowIndex} columnIndex={2} color={color} additionalClass={"no-left"} />
                <NonEditableCell value={row[3]} rowIndex={rowIndex} columnIndex={3} color={color} additionalClass={"no-left"} />
                <WorkerDropdown value={row[4]} rowIndex={rowIndex} columnIndex={4} color={color} workerList={generateWorkerList(rowIndex,capitalizeFirstLetter(row[0]))} onCellEdit={onCellEdit} />
            </tr >
        </>
    );

}
