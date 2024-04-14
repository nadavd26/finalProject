import "../css/TableRow.css"; // Import your CSS file for styling
import FreeEditCell from '../components/FreeEditCell';
import NonEditableCell from "../components/NonEditableCell";
import WorkerDropdown from "../components/WorkerDropdown";
import ActionCell from "../components/ActionCell";
import * as utils from '../../Utils'
export default function TableRow({ row, rowIndex, onCellEdit, color, workerMap, shiftsPerWorker, shiftsInfo, content}) {
    function generateWorkerList() {
        // Extract the skill from the row data
        const skill = row[1];
        
        // Check if the workerMap contains the skill as a key
        if (workerMap.has(skill)) {
            // If the skill exists in the workerMap, get the corresponding worker list
            const workerList = workerMap.get(skill);
            
            // Initialize an array to store the transformed worker list
            const transformedWorkerList = [];
            
            // Extract the name and id from row[4]
            const [name, id] = row[4].split("\n");
    
            // Loop through the workerList and filter out workers with matching ids
            for (const worker of workerList) {
                // Exclude the worker if the id matches
                if (id !== worker.id.toString()) {
                    transformedWorkerList.push({
                        id: worker.id, // Assuming the worker object has an id property
                        name: worker.name, // Assuming the worker object has a name property
                        color: getColor(id, name)
                    });
                }
            }
            
            return transformedWorkerList; // Return the transformed worker list
        } else {
            // If the skill does not exist in the workerMap, return an empty list
            return [];
        }
    }

    function getColor(id, name) {
        // console.log("shiftsPerWorker")
        // console.log(shiftsPerWorker)
        const key = utils.getWorkerShiftListKey(id, name)
        const shiftSet = shiftsPerWorker[key]
        // console.log("shiftSet")
        // console.log(shiftSet)
        if (!shiftSet) {
            return "white"
        }

        shiftSet.forEach(shiftId => {
            const shiftInfoEntry = shiftsInfo[shiftId]
            const shift = content[shiftInfoEntry.start]
            if (utils.checkOverlap(shift[2], shift[3], row[2], row[3])) {
                return "red"
            }
        });

        return "white"
    }
    
    
    
    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                <ActionCell rowIndex={rowIndex} color={color}></ActionCell>
                <NonEditableCell value={row[0]} rowIndex={rowIndex} coloumnIndex={0} color={color} additionalClass={"no-left"}/>
                <NonEditableCell value={row[1]} rowIndex={rowIndex} columnIndex={1} color={color} additionalClass={"no-left"}/>
                <NonEditableCell value={row[2]} rowIndex={rowIndex} columnIndex={2}  color={color} additionalClass={"no-left"}/>
                <NonEditableCell value={row[3]} rowIndex={rowIndex} columnIndex={3}  color={color} additionalClass={"no-left"}/>
                <WorkerDropdown value={row[4]} rowIndex={rowIndex} columnIndex={4} color={color} onEdit={onCellEdit} workerList={generateWorkerList()}/>
            </tr >
        </>
    );
}
