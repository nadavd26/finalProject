import React from 'react';
import "../css/TableRow.css"; // Import your CSS file for styling
import FreeEditCell from '../components/FreeEditCell';
import NonEditableCell from "../components/NonEditableCell";
import ShiftIdCell from "../components/ShiftIdCell";
import WorkerDropdown from "../components/WorkerDropdown";
import ActionCell from "../components/ActionCell";
// import MemorizedTableRow from './TableRow'
import * as utils from '../../Utils'
import { useState } from "react";
import { memo } from 'react';

const Foo = () => {
    console.log("render foo")
    return (
        <>
            <div>hiiiiiiiiiiiiiii</div>
            <div>hiiiiiiiiiiiiiii</div>
            <div>hiiiiiiiiiiiiiii</div>
            <div>hiiiiiiiiiiiiiii</div>
        </>)
}
const MemorizedFoo = React.memo(Foo)

const TableRow = ({rowIndex,row,color,generateWorkerList, onCellEdit, getLineInfo}) => {
    console.log("render row num " + (rowIndex+1))
    //TODO make useMemo
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                <ActionCell rowIndex={rowIndex} color={color} getLineInfo={getLineInfo}></ActionCell>
                <NonEditableCell value={row[0]} rowIndex={rowIndex} coloumnIndex={0} color={color} additionalClass={"no-left"} shiftIndex={row[5]}/>
                <NonEditableCell value={row[1]} rowIndex={rowIndex} columnIndex={1} color={color} additionalClass={"no-left"} shiftIndex={row[5]}/>
                <NonEditableCell value={row[2]} rowIndex={rowIndex} columnIndex={2} color={color} additionalClass={"no-left"} shiftIndex={row[5]}/>
                <NonEditableCell value={row[3]} rowIndex={rowIndex} columnIndex={3} color={color} additionalClass={"no-left"} shiftIndex={row[5]}/>
                <WorkerDropdown value={row[4]} rowIndex={rowIndex} columnIndex={4} color={color} workerList={generateWorkerList(rowIndex,capitalizeFirstLetter(row[0]))} onCellEdit={onCellEdit} shiftIndex={row[5]}/>
                <ShiftIdCell value={row[5]} rowIndex={rowIndex} columnIndex={3} color={color} additionalClass={"no-left"} shiftIndex={row[5]}/>
            </tr >
        </>
    );

};

function arePropsEqual(oldProps, newProps) {
    return !(newProps.shouldRender)
}

const MemorizedTableRow = React.memo(TableRow, arePropsEqual)
//first row : [{name : , validate : function}, ....]
function Table({ content, colors, shiftsPerWorker, workerMap, shiftsInfo, onCellEdit, generateWorkerList, getLineInfo, rowsToRender }) {
    return (
        <div className="container-table100">
            <div className="wrap-table100">
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th className="cell100 col-1 first-column blue static-position" id="first-row-first-col"></th>
                                    <th class="cell100  last-columns blue col-1">Day</th>
                                    <th class="cell100  last-columns blue col-2">Skill</th>
                                    <th class="cell100  last-columns blue col-2">From</th>
                                    <th class="cell100  last-columns blue col-2">Until</th>
                                    <th class="cell100  last-columns blue col-3">Assigned Worker</th>
                                    <th class="cell100  last-columns blue col-1">Shift Number</th>
                                </tr>

                                {content.map((row, index) => (
                                    <>
                                    {/* <MemorizedFoo></MemorizedFoo> */}
                                    <MemorizedTableRow
                                        rowIndex={index}
                                        row={row}
                                        color={colors[index]}
                                        workerMap={workerMap}
                                        shiftsInfo={shiftsInfo}
                                        generateWorkerList={generateWorkerList}
                                        onCellEdit={onCellEdit}
                                        getLineInfo={getLineInfo}
                                        shouldRender={rowsToRender[index]}
                                    />
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;

