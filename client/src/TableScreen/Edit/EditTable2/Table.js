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
    // console.log("render row num " + (rowIndex + 1));
    // console.log("color " + color)

    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Define inline style for hidden rows
    const rowStyle = {
        opacity: hidden ? 0 : 1 // Set opacity to 0 if hidden, otherwise set it to 1
    };

    return (
        <tr className="row100 body last-rows" id="table-row" style={{opacity: hidden ? 0 : 1, height: "6vh", fontSize: "1vw"}}>
            <NonEditableCell value={rowIndex + 1} rowIndex={rowIndex} coloumnIndex={0} color={color} shiftIndex={row[5]} hidden={hidden} style={{fontSize: "1vw"}}/>
            <NonEditableCell value={capitalizeFirstLetter(row[0])} rowIndex={rowIndex} coloumnIndex={0} color={color} additionalClass={"no-left second"} shiftIndex={row[5]} hidden={hidden} style={{fontSize: "1.5vw"}}/>
            <NonEditableCell value={row[1]} rowIndex={rowIndex} columnIndex={1} color={color} additionalClass={"no-left"} shiftIndex={row[5]} hidden={hidden} style={{fontSize: "1.3vw"}}/>
            <NonEditableCell value={row[2]} rowIndex={rowIndex} columnIndex={2} color={color} additionalClass={"no-left"} shiftIndex={row[5]} hidden={hidden} style={{fontSize: "1.5vw"}}/>
            <NonEditableCell value={row[3]} rowIndex={rowIndex} columnIndex={3} color={color} additionalClass={"no-left"} shiftIndex={row[5]} hidden={hidden} style={{fontSize: "1.5vw"}}/>
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
    // console.log("render table" + start)
    // console.log("linesFiltered")
    // console.log(linesFiltered)
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
    // for (let i = end; i < pageSize + start - 1; i++) {
    //     renderedRows.push(
    //         <MemorizedTableRow
    //             rowIndex={0}
    //             row={["a", "a", "a", "a", "a", "a", "a", "a"]}
    //             color={"white"}
    //             workerMap={workerMap}
    //             shiftsInfo={shiftsInfo}
    //             generateWorkerList={() => []}
    //             onCellEdit={() => { }}
    //             getLineInfo={() => { }}
    //             shouldRender={true}
    //             hidden={true}
    //         />
    //     )
    // }

    const widths=[12, 18, 10, 10, 25, 14]
    const vw = (num) => {
        return num+"vw"
    }

    const vw1 = (num) => {
        return (num-1.25) + "vw"
    }
    return (
        <div className="container-table100">
            <div className="wrap-table100" style={{width: "100vw"}}>
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar" style={{maxHeight: "100vh", height: "75vh"}}>
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row" style={{fontSize: "1.1vw"}}>
                                    <th className="cell100 first-column blue static-position" id="first-row-first-col" style={{maxWidth: "11vw"}}><div style={{fontSize: "1vw"}}>Index</div><div>{indexSearchElement()}</div></th>
                                    <th class="cell100  last-columns blue " id="header" style={{maxWidth: vw(widths[0])}}><div style={{fontSize: "1vw"}}>Day</div><div>{searchDayElement(vw1(widths[0]))}</div></th>
                                    <th class="cell100  last-columns blue " id="header" style={{maxWidth: vw(widths[1])}}><div style={{fontSize: "1vw"}}>Skill</div><div>{searchSkillElement(vw1(widths[1]))}</div></th>
                                    <th class="cell100  last-columns blue " id="header" style={{maxWidth: vw(widths[2])}}><div style={{fontSize: "1vw"}}>From</div><div>{searchFromElement(vw1(widths[2]))}</div></th>
                                    <th class="cell100  last-columns blue" id="header" style={{maxWidth: vw(widths[3])}}><div style={{fontSize: "1vw"}}>Until</div><div>{searchUntilElement(vw1(widths[3]))}</div></th>
                                    <th class="cell100  last-columns blue " id="header" style={{maxWidth: vw(widths[4])}}><div style={{fontSize: "1vw"}}>Assigned Worker</div><div>{searchAssignedElement(vw1(widths[4]))}</div></th>
                                    <th class="cell100  last-columns blue" id="header" style={{maxWidth: vw(widths[5])}}><div style={{fontSize: "1vw"}}>Shift Number</div><div>{searchShiftIndexElement(vw1(widths[5]))}</div></th>
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

