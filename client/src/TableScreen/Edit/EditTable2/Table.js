import React from 'react';
import "../css/TableRow.css"; // Import your CSS file for styling
import FreeEditCell from '../components/FreeEditCell';
import NonEditableCell from "../components/NonEditableCell";
import ShiftIdCell from "../components/ShiftIdCell";
import WorkerDropdown from "../components/WorkerDropdown";
// import MemorizedTableRow from './TableRow'
import * as utils from '../../Utils'
import { useState } from "react";
import { memo } from 'react';


const TableRow = ({ rowIndex, row, color, generateWorkerList, onCellEdit, getLineInfo, hidden }) => {
    console.log("render row num " + (rowIndex + 1));

    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Define inline style for hidden rows
    const rowStyle = {
        opacity: hidden ? 0 : 1 // Set opacity to 0 if hidden, otherwise set it to 1
    };

    return (
        <tr className="row100 body last-rows" id="table-row" style={rowStyle}>
            <NonEditableCell value={rowIndex + 1} rowIndex={rowIndex} coloumnIndex={0} color={color} shiftIndex={row[5]} hidden={hidden} />
            <NonEditableCell value={capitalizeFirstLetter(row[0])} rowIndex={rowIndex} coloumnIndex={0} color={color} additionalClass={"no-left second"} shiftIndex={row[5]} hidden={hidden} />
            <NonEditableCell value={row[1]} rowIndex={rowIndex} columnIndex={1} color={color} additionalClass={"no-left"} shiftIndex={row[5]} hidden={hidden} />
            <NonEditableCell value={row[2]} rowIndex={rowIndex} columnIndex={2} color={color} additionalClass={"no-left"} shiftIndex={row[5]} hidden={hidden} />
            <NonEditableCell value={row[3]} rowIndex={rowIndex} columnIndex={3} color={color} additionalClass={"no-left"} shiftIndex={row[5]} hidden={hidden} />
            <WorkerDropdown value={row[4]} rowIndex={rowIndex} columnIndex={4} color={color} workerList={generateWorkerList(rowIndex, capitalizeFirstLetter(row[0]))} onCellEdit={onCellEdit} shiftIndex={row[5]} getLineInfo={getLineInfo} hidden={hidden} />
            <ShiftIdCell value={(row[5] + 1)} rowIndex={rowIndex} columnIndex={3} color={color} additionalClass={"no-left"} shiftIndex={row[5]} hidden={hidden} />
        </tr>
    );
};





function arePropsEqual(oldProps, newProps) {
    if (newProps.shouldRender) {
        return false
    }
    return true
}

const MemorizedTableRow = React.memo(TableRow, arePropsEqual)
//first row : [{name : , validate : function}, ....]
function Table({ linesFiltered, content, start, pageSize, colors, shiftsPerWorker, workerMap, shiftsInfo, onCellEdit, generateWorkerList, getLineInfo, rowsToRender, indexSearchElement, searchDayElement, searchSkillElement, searchFromElement, searchUntilElement, searchAssignedElement, searchShiftIndexElement }) {
    console.log("render table" + start)
    console.log("linesFiltered")
    console.log(linesFiltered)
    const renderedRows = [];
    var end = Math.min(pageSize + start - 1, linesFiltered.length - 1)
    for (let i = start; i <= end; i++) {
        const originalIndex = linesFiltered[i]
        renderedRows.push(
            <MemorizedTableRow
                rowIndex={originalIndex}
                row={content[originalIndex]}
                color={colors[originalIndex]}
                workerMap={workerMap}
                shiftsInfo={shiftsInfo}
                generateWorkerList={generateWorkerList}
                onCellEdit={onCellEdit}
                getLineInfo={getLineInfo}
                shouldRender={rowsToRender[originalIndex]}
                hidden={false}
            />
        );
    }
    for (let i = end; i < pageSize + start - 1; i++) {
        renderedRows.push(
            <MemorizedTableRow
                rowIndex={0}
                row={["a", "a", "a", "a", "a", "a", "a", "a"]}
                color={"white"}
                workerMap={workerMap}
                shiftsInfo={shiftsInfo}
                generateWorkerList={() => []}
                onCellEdit={() => { }}
                getLineInfo={() => { }}
                shouldRender={true}
                hidden={true}
            />
        )
    }
    return (
        <div className="container-table100">
            <div className="wrap-table100">
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th className="cell100 col-2 first-column blue static-position" id="first-row-first-col"><div>Index</div><div>{indexSearchElement()}</div></th>
                                    <th class="cell100  last-columns blue col-2"><div>Day</div><div>{searchDayElement()}</div></th>
                                    <th class="cell100  last-columns blue col-2"><div>Skill</div><div>{searchSkillElement()}</div></th>
                                    <th class="cell100  last-columns blue col-1"><div>From</div><div>{searchFromElement()}</div></th>
                                    <th class="cell100  last-columns blue col-1"><div>Until</div><div>{searchUntilElement()}</div></th>
                                    <th class="cell100  last-columns blue col-3"><div>Assigned Worker</div><div>{searchAssignedElement()}</div></th>
                                    <th class="cell100  last-columns blue col-2"><div>Shift Number</div><div>{searchShiftIndexElement()}</div></th>
                                </tr>
                                {renderedRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;

