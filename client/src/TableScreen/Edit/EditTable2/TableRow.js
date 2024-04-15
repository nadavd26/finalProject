import "../css/TableRow.css"; // Import your CSS file for styling
import FreeEditCell from '../components/FreeEditCell';
import NonEditableCell from "../components/NonEditableCell";
import WorkerDropdown from "../components/WorkerDropdown";
import ActionCell from "../components/ActionCell";
import * as utils from '../../Utils'
import { useState } from "react";
export default function TableRow({ row, rowIndex, color, workerMap, shiftsPerWorker, shiftsInfo, content, colors, setContentColors }) {
    function generateWorkerList() {
        const skill = row[1];
        if (workerMap.has(skill)) {
            const workerList = workerMap.get(skill);
            const unavaliableWorkers = []
            const start = shiftsInfo[row[5]].start
            const end = shiftsInfo[row[5]].end
            for (let i = start; i <= end; i++) {
                const [name, id] = (content[i][4]).split("\n")
                unavaliableWorkers.push({ name: name, id: id })
            }
            const filteredWorkerList = workerList.filter(worker => {
                return !unavaliableWorkers.some(unavailable => {
                    return unavailable.id === worker.id;
                });
            });
            const transformedWorkerList = [];
            const [name, id] = row[4].split("\n");
            for (const worker of filteredWorkerList) {
                transformedWorkerList.push({
                    id: worker.id, // Assuming the worker object has an id property
                    name: worker.name, // Assuming the worker object has a name property
                    color: getColor(id, name)
                });
            }
            return transformedWorkerList; // Return the transformed worker list
        } else {
            // If the skill does not exist in the workerMap, return an empty list
            return [];
        }
    }

    function getColor(id, name) {
        const shiftSet = utils.getShiftsForWorker(shiftsPerWorker, id, name)
        shiftSet.forEach(shiftId => {
            const shiftInfoEntry = shiftsInfo[shiftId]
            const shift = content[shiftInfoEntry.start]
            if (utils.checkOverlap(shift[2], shift[3], row[2], row[3])) {
                return "red"
            }
        });

        return "white"
    }

    function changeWorkerShift(newWorker) {
        var newTable = content
        var newColors = colors
        const [newName, newId, newColor] = newWorker.split(",")
        const [oldName, oldId] = (row[4]).split("\n")
        var newShiftPerWorkers = utils.addShiftToWorker(shiftsPerWorker, newId, newName, row[5])
        utils.removeShiftFromWorker(newShiftPerWorkers, oldId, oldName, row[5])
        console.log("newShiftPerWorkers")
        console.log(newShiftPerWorkers)
        newTable[rowIndex][4] = newName + "\n" + newId
        newColors[rowIndex] = newColor
        setContentColors({ table: newTable, colors: newColors, shiftsPerWorkers: newShiftPerWorkers })
    }



    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                <ActionCell rowIndex={rowIndex} color={color}></ActionCell>
                <NonEditableCell value={row[0]} rowIndex={rowIndex} coloumnIndex={0} color={color} additionalClass={"no-left"} />
                <NonEditableCell value={row[1]} rowIndex={rowIndex} columnIndex={1} color={color} additionalClass={"no-left"} />
                <NonEditableCell value={row[2]} rowIndex={rowIndex} columnIndex={2} color={color} additionalClass={"no-left"} />
                <NonEditableCell value={row[3]} rowIndex={rowIndex} columnIndex={3} color={color} additionalClass={"no-left"} />
                <WorkerDropdown value={row[4]} rowIndex={rowIndex} columnIndex={4} color={color} workerList={generateWorkerList()} onEdit={changeWorkerShift} />
            </tr >
        </>
    );
}
