import { useEffect, useState } from "react";
import Table from "./Table";
import '../css/bootstrap.min.css'
import '../css/edit-file-table-main.css'
import '../css/perfect-scrollbar.css'
import * as utils from '../../Utils'

export default function EditResFile2({ initialTable, setInEdit, user, setUser, workerMap, shiftsInfo, shiftsPerWorkers }) {
    const [showBackModal, setShowBackModal] = useState(false)
    const [renderInfo, setRenderInfo] = useState({ table: [["", "", "", "", "", ""]], colors: [], shiftsPerWorkers: {} })
    // Initialize an array to hold state objects
    const stateArray = [];

    // Create states and push them into the array

    // Use stateArray to access the states

    const defaultErrorMsg = "Assigned Number Of Workers is a non-negative integer."
    const [errorMsg, setErrorMsg] = useState(defaultErrorMsg)
    const token = user.token
    console.log("worker List ")
    console.log(workerMap)
    console.log("shifts info ")
    console.log(shiftsInfo)
    console.log("shiftsPerWorkers")
    console.log(JSON.stringify(renderInfo.shiftsPerWorkers))
    useEffect(() => {
        const newTable = initialTable.Sunday.concat(
            initialTable.Monday,
            initialTable.Tuesday,
            initialTable.Wednesday,
            initialTable.Thursday,
            initialTable.Friday,
            initialTable.Saturday
        );
        var newColors = Array.from({
            length: initialTable.Sunday.length + initialTable.Monday.length + initialTable.Tuesday.length +
                initialTable.Wednesday.length + initialTable.Thursday.length + initialTable.Friday.length + initialTable.Saturday.length
        }, () => "white")
        setRenderInfo({ table: newTable, colors: newColors, shiftsPerWorkers: shiftsPerWorkers })
    }, []);

    function getColor(id, name, day, row) {
        const shiftSet = utils.getShiftsForWorker((renderInfo.shiftsPerWorkers)[day], id, name);

        for (const shiftId of shiftSet) {
            const shiftInfoEntry = shiftsInfo[day][shiftId];
            const shift = renderInfo.table[shiftInfoEntry.start + firstIndex(day)];

            console.log("row : " + row + " shift : " + shift);
            if (utils.checkOverlap(shift[2], shift[3], row[2], row[3])) {
                console.log("overlap");
                return "red"; // Return "red" if there's an overlap
            }
        }

        return "white"; // Return "white" if no overlap is found
    }


    function firstIndex(day) {
        var sum = 0;
        if (day === "Sunday") {
            return sum;
        }
        sum += initialTable.Sunday.length;
        if (day === "Monday") {
            return sum;
        }
        sum += initialTable.Monday.length;
        if (day === "Tuesday") {
            return sum;
        }
        sum += initialTable.Tuesday.length;
        if (day === "Wednesday") {
            return sum;
        }
        sum += initialTable.Wednesday.length;
        if (day === "Thursday") {
            return sum;
        }
        sum += initialTable.Thursday.length;
        if (day === "Friday") {
            return sum;
        }
        sum += initialTable.Friday.length;
        if (day === "Saturday") {
            return sum;
        }
    }

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function generateWorkerList(rowIndex, day) {
        const row = (renderInfo.table)[rowIndex]
        // console.log("row")
        // console.log(row)
        const skill = row[1];
        if (workerMap.has(skill)) {
            const workerList = workerMap.get(skill);
            const unavaliableWorkers = []
            const start = shiftsInfo[day][row[5]].start + firstIndex(day)
            const end = shiftsInfo[day][row[5]].end + firstIndex(day)
            for (let i = start; i <= end; i++) {
                const nameId = ((renderInfo.table))[i][4]
                const [name, id] = (nameId).split("\n")
                unavaliableWorkers.push({ name: name, id: id })
            }
            const filteredWorkerList = workerList.filter(worker => {
                return !unavaliableWorkers.some(unavailable => {
                    return unavailable.id === worker.id;
                });
            });
            const transformedWorkerList = [];
            const [name, id] = row[4].split("\n");
            // console.log("filteredWorkerList")
            // console.log(filteredWorkerList)
            for (let i = 0; i < filteredWorkerList.length; i++) {
                const worker = filteredWorkerList[i]
                transformedWorkerList.push({
                    id: worker.id, // Assuming the worker object has an id property
                    name: worker.name, // Assuming the worker object has a name property
                    color: getColor(worker.id, worker.name, day, row)
                });
            }

            console.log("transformedWorkerList")
            console.log(transformedWorkerList)
            return transformedWorkerList; // Return the transformed worker list
        } else {
            // If the skill does not exist in the workerMap, return an empty list
            return [];
        }
    }

    function getAbsuluteIndex(relativeIndex, day) {
        return firstIndex(day) + relativeIndex
    }

    function getRelativeIndex(absuluteIndex, day) {
        return absuluteIndex - firstIndex(day)
    }

    function handleCellEdit(newWorker, rowIndex) {
        const row = (renderInfo.table)[rowIndex]
        const day = capitalizeFirstLetter(row[0])
        var newTable = renderInfo.table
        const oldColor = (renderInfo.colors)[rowIndex]
        var newColors = renderInfo.colors
        const [newName = "", newId = "", newColor = "white"] = newWorker.split(",")
        const [oldName, oldId] = (row[4]).split("\n")
        var newShiftPerWorkersDay = newName != "" ? utils.addShiftToWorker((renderInfo.shiftsPerWorkers)[day], newId, newName, getRelativeIndex(rowIndex, day)) : (renderInfo.shiftsPerWorkers)[day]
        utils.removeShiftFromWorker(newShiftPerWorkersDay, oldId, oldName, getRelativeIndex(rowIndex, day))
        var newShiftPerWorkers = renderInfo.shiftsPerWorkers
        newShiftPerWorkers[day] = newShiftPerWorkersDay
        newTable[rowIndex][4] = (newName == "") ? "" : newName + "\n" + newId
        newColors[rowIndex] = newColor
        if (newColor == "red") { //checking for overlapping shifts to color in red
            const shiftsOfNewWorker = utils.getShiftsForWorker((renderInfo.shiftsPerWorkers)[day], newId, newName)
            for (const relativeIndex of shiftsOfNewWorker) {
                const absuluteIndex = getAbsuluteIndex(relativeIndex, day)
                const from = (renderInfo.table)[absuluteIndex][2]
                const until = (renderInfo.table)[absuluteIndex][3]
                if (utils.checkOverlap(from, until, row[2], row[3])) { //overlaps with some shift of new worker
                    newColors[absuluteIndex] = "red"
                }
            }
        }

        console.log("renderInfo.colors")
        console.log(renderInfo.colors)
        console.log("oldColor")
        console.log(oldColor)
        if (oldColor == "red") {//removing the overlaps of the old worker
            console.log("newShiftPerWorkersDay")
            console.log(newShiftPerWorkersDay)
            console.log("oldId, oldName")
            console.log(oldId, oldName)
            const shiftsOfOldWorker = utils.getShiftsForWorker(newShiftPerWorkersDay, oldId, oldName)
            console.log("shiftsOfOldWorker")
            console.log(shiftsOfOldWorker)
            for (const relativeIndex of shiftsOfOldWorker) {
                // console.log("relativeIndex")
                // console.log(relativeIndex)
                const absuluteIndex = getAbsuluteIndex(relativeIndex, day)
                const from = (renderInfo.table)[absuluteIndex][2]
                const until = (renderInfo.table)[absuluteIndex][3]
                if (utils.checkOverlap(from, until, row[2], row[3])) {
                    //found overlap, now need to check this is the only overlap in order to color it a "white"
                    var found = false
                    const shiftsOfOldWorker2 = shiftsOfOldWorker
                    for (const relativeIndex2 of shiftsOfOldWorker2) {
                        if (relativeIndex2 != relativeIndex) { //check overlap for other shift that isnt the shift we are checking
                            const absuluteIndex2 = getAbsuluteIndex(relativeIndex2, day)
                            const from2 = (renderInfo.table)[absuluteIndex2][2]
                            const until2 = (renderInfo.table)[absuluteIndex2][3]
                            if (utils.checkOverlap(from, until, from2, until2)) {
                                found = true
                            }
                        }
                    }

                    if (!found) { //only overlap it has it is with the original shift
                        newColors[absuluteIndex] = "white"
                    }
                }
            }
        }
        console.log("newShiftPerWorkers")
        console.log(newShiftPerWorkers)
        setRenderInfo({ table: newTable, colors: newColors, shiftsPerWorkers: newShiftPerWorkers })
    }


    const handleSave = async () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
        const saveModal = new window.bootstrap.Modal(document.getElementById('saveModal'));

        var isValid = true;
        // if (content.length === 0) {
        //     isValid = false;
        // }
        // content.forEach((row) => {

        // });

        if (!isValid) {
            setErrorMsg(defaultErrorMsg)
            errorModal.show()
            return
        } else {
            saveModal.show()
        }
    };

    const handleErrorModalClose = () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
        errorModal.hide()
    };

    const handleSuccessModalClose = () => {
        const saveModal = new window.bootstrap.Modal(document.getElementById('saveModal'));
        saveModal.hide()
    };

    const handleBackModalClose = () => {
        setShowBackModal(false)
    }

    const finishEdit = async () => {
        var newUser = user
        setUser(newUser)
        setInEdit(false)
    };

    const handleBack = () => {
        setShowBackModal(true)
    }

    const handleExit = () => {
        setInEdit(false)
    }

    return (
        <div id="edit-file">
            <div className="container-fluid py-3">
                <div className="col-1">
                    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#backModal" onClick={handleBack}>Back</button>
                </div>
                <div className="col-11"></div>
                <Table content={renderInfo.table} colors={renderInfo.colors} shiftsPerWorker={renderInfo.shiftsPerWorkers}
                    workerMap={workerMap} shiftsInfo={shiftsInfo} onCellEdit={handleCellEdit} generateWorkerList={generateWorkerList}></Table>
                <div className="row"><br /></div>
                <div className="d-flex justify-content-between mb-3 down-buttons">
                    <div className="col-3"></div>
                    <button className="btn btn-success col-3" onClick={handleSave}
                        data-toggle="modal" >Save</button>
                    <div className="col-3"></div>
                </div>
            </div>
            {showBackModal && (
                <div class="modal fade show" id="backModal" tabindex="-1" role="dialog" aria-labelledby="backModal" aria-hidden="true" onHide={handleBackModalClose}>
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content modal-danger"> {/* Add custom class modal-danger */}
                            <div class="modal-header">
                                <h5 class="modal-title text-danger" id="backModalLongTitle">Changes will be discarded</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-danger"> {/* Add text-danger for red text */}
                                Are you sure you want to continue?
                            </div>
                            <div class="modal-footer">
                                <div className="col-4" />
                                <div className="col-2">
                                    <button type="button" class="btn btn-danger" data-dismiss="modal" onClick={handleExit}>Ok</button>
                                </div>
                                <div className="col-2">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                                </div>
                                <div className="col-4" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {true && (
                <div class="modal fade show" id="errModal" tabindex="-1" role="dialog" aria-labelledby="saveModal" aria-hidden="true" onHide={handleErrorModalClose} style={{ whiteSpace: 'pre-line' }}>
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content modal-danger"> {/* Add custom class modal-danger */}
                            <div class="modal-header">
                                <h5 class="modal-title text-danger" id="saveModalLongTitle">Cannot Save Changes</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-danger"> {/* Add text-danger for red text */}
                                {errorMsg}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Go Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {true && (
                <div class="modal fade show" id="saveModal" tabindex="-1" role="dialog" aria-labelledby="saveModal" aria-hidden="true" onHide={handleSuccessModalClose}>
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content modal-success"> {/* Add custom class modal-success */}
                            <div class="modal-header">
                                <h5 class="modal-title text-success" id="saveModalLongTitle">Changes Saved Successfully</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-success"> {/* Add text-success for green text */}
                                Your changes have been saved successfully.
                            </div>
                            <div class="modal-footer">
                                <div className="col-4" />
                                <div className="col-2">
                                    <button type="button" class="btn btn-success" data-dismiss="modal" onClick={finishEdit}>Finish</button>
                                </div>
                                <div className="col-2">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Keep Editing</button>
                                </div>
                                <div className="col-4" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>)
}