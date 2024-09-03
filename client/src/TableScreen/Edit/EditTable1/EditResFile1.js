import { useEffect, useRef, useState } from "react";
import Table from "./Table";
import '../css/bootstrap.min.css'
import '../css/edit-file-table-main.css'
import '../css/perfect-scrollbar.css'
import * as utils from '../../Utils'
import Kpi from "../components/Kpi";
import * as algo1api from '../../../api/Algo1Api'

const computeWastedHours = (reqs, shiftsArray) => {
    let sum = 0;
    for (let i = 0; i < 48; i++)
        sum += Math.max(0, shiftsArray[i] - reqs[i])
    return sum / 2
}
const hourToIndex = (hour) => {
    if (typeof hour !== 'string') {
        // Handle the case where hour is not a string
        return -1; // or any other default value
    }
    const [hours, minutes] = hour.split(':');
    return hours * 2 + (minutes === '30' ? 1 : 0);
};
const hoursToArrayNumber = (startHour, endHour, num) => {
    const start = hourToIndex(startHour);
    let end = hourToIndex(endHour);
    if (end === 0) {
        end = 48;
    }
    const hoursArray = Array.from({ length: 48 }, (_, i) => (start <= i && i < end) ? num : 0);
    return hoursArray;
};

function sumArrays(arr1, arr2) {
    console.log("sum array arr1")
    console.log(arr1)
    console.log("sum array arr2")
    console.log(arr2)
    const maxLength = Math.max(arr1.length, arr2.length);
    const result = new Array(maxLength).fill(0);

    for (let i = 0; i < maxLength; i++) {
        const val1 = arr1[i] !== undefined ? arr1[i] : 0;
        const val2 = arr2[i] !== undefined ? arr2[i] : 0;
        result[i] = val1 + val2;
    }

    return result;
}

function subArrays(arr1, arr2) {
    const maxLength = Math.max(arr1.length, arr2.length);
    const result = new Array(maxLength).fill(0);

    for (let i = 0; i < maxLength; i++) {
        const val1 = arr1[i] !== undefined ? arr1[i] : 0;
        const val2 = arr2[i] !== undefined ? arr2[i] : 0;
        result[i] = val1 - val2;
    }

    return result;
}

export default function EditResFile1({ initialTable, setInEdit, user, setUser, currentDay, currentSkill, setWorksPerShift, finishCallback }) {
    const [content, setContent] = useState([["", "", "", "", ""]])
    // console.log("initialTable")
    // console.log(initialTable)
    const [showBackModal, setShowBackModal] = useState(false)
    const defaultErrorMsg = "Assigned Number Of Workers is a non-negative integer and cannot be bigger than the total amount of workers"
    const [errorMsg, setErrorMsg] = useState(defaultErrorMsg)
    const [rowsToRender, setRowsToRender] = useState({})
    var initialSumShifts = useRef([])
    var sumShifts = useRef([])



    const [wastedHoursKpi, setWastedHoursKpi] = useState(0)
    var intialWastedHours = useRef(0)



    var initialCost = useRef(0)
    const [costKpi, setCostKpi] = useState(0)
    var initialAppliesToReqs = useRef(true)
    const [warningMsg, setWarningMsg] = useState("")




    const token = user.token
    // console.log("key isssssssssss : " + currentDay + "******" + currentSkill)
    function isNumberOfWorkersValid(numOfWorkers) {
        if (numOfWorkers === "") {
            return false
        }
        const parsedValue = Number(numOfWorkers);
        // console.log("parsedValue")
        // console.log(parsedValue)
        return Number.isInteger(parsedValue) && parsedValue >= 0 && parsedValue <= user.table1.length;
    };

    function calcCost() {
        var cost = 0
        for (let i = 0; i < initialTable.length; i++) {
            var costShift = initialTable[i][5]
            cost = cost + (costShift * initialTable[i][4])
        }
        // console.log("cost")
        // console.log(cost)
        return cost
    }




    function doesApply(reqs, sumShifts) {
        for (let j = 0; j < 48; j++) {
            if (reqs[j] > sumShifts[j]) {
                return false
            }
        }

        return true
    }
    useEffect(() => {
        var initialSumShiftsTemp = []
        for (let i = 0; i < initialTable.length; i++) {
            const line = initialTable[i]
            var shiftsArray = hoursToArrayNumber(line[2], line[3], parseInt(line[4]))
            initialSumShiftsTemp = sumArrays(initialSumShiftsTemp, shiftsArray)
        }
        initialSumShifts.current = initialSumShiftsTemp
        sumShifts.current = initialSumShiftsTemp

        var intialWastedHoursTemp = computeWastedHours(user.currentRequestArray, initialSumShiftsTemp)
        setWastedHoursKpi(intialWastedHoursTemp)
        intialWastedHours.current = intialWastedHoursTemp
        setContent(initialTable.map(row => [...row]))
        var newRowsToRender = {}
        for (let i = 0; i < initialTable.length; i++) {
            newRowsToRender[i] = true
        }
        setRowsToRender(newRowsToRender)
        var initCost = calcCost()
        initialCost.current = (initCost)
        setCostKpi(initCost)
        const reqs = user.currentRequestArray
        var applies = doesApply(reqs, sumShifts.current)

        // console.log("applies")
        // console.log(applies)

        if (!applies) {
            initialAppliesToReqs.current = false
        }
    }, []);

    useEffect(() => {
        // console.log("content")
        // console.log(content)
    }, [content])



    // Convert hours to array number




    const handleCellEdit = (rowIndex, columnIndex, value, oldValue) => {
        // console.log("value")
        // console.log(value)
        // console.log("oldValue")
        // console.log(oldValue)
        console.log("sumShifts")
        console.log(sumShifts)
        if (value == oldValue) {
            var newRowsToRender = {}
            newRowsToRender[rowIndex] = true
            setRowsToRender(newRowsToRender)
            return
        }
        if (!isNumberOfWorkersValid(value)) {
            // console.log("not valud")
            var newRowsToRender = {}
            newRowsToRender[rowIndex] = true
            var updatedContent = content
            updatedContent[rowIndex][columnIndex] = oldValue
            setRowsToRender(newRowsToRender)
            setContent(updatedContent)
            return
        }
        var updatedContent = content
        var price = updatedContent[rowIndex][5]
        updatedContent[rowIndex][columnIndex] = value
        setCostKpi(prevCostKpi => prevCostKpi - (price * (oldValue - value))); // Functional update
        var newRow = updatedContent[rowIndex]
        var oldRow = [...newRow]
        oldRow[4] = oldValue
        var newShiftsArray = hoursToArrayNumber(newRow[2], newRow[3], parseInt(newRow[4]))
        var oldShiftsArray = hoursToArrayNumber(oldRow[2], oldRow[3], parseInt(oldRow[4]))
        var wastedHoursReduce = computeWastedHours(user.currentRequestArray, oldShiftsArray)
        var wastedHoursAdd = computeWastedHours(user.currentRequestArray, newShiftsArray)

        var newSumShifts = subArrays(sumArrays(sumShifts.current, newShiftsArray), oldShiftsArray)
        console.log("newSumShifts")
        console.log(newSumShifts)
        // setSumShifts(prevSumShifts => subArrays(sumArrays(prevSumShifts, newShiftsArray), oldShiftsArray))
        var newWastedKpi = computeWastedHours(user.currentRequestArray, newSumShifts)
        console.log("newWastedKpi")
        console.log(newWastedKpi)

        var newRowsToRender = {}
        newRowsToRender[rowIndex] = true
        setRowsToRender(newRowsToRender)
        setContent(updatedContent);
        sumShifts.current = newSumShifts
        setWastedHoursKpi(newWastedKpi)
        // console.log("content")
        // console.log(content)
    };


    const handleSave = async () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
        const saveModal = new window.bootstrap.Modal(document.getElementById('saveModal'));
        const warningModal = new window.bootstrap.Modal(document.getElementById('warningModal'));


        var isValid = true;
        if (content.length === 0) {
            isValid = false;
        }
        content.forEach((row, index) => {
            const workerCell = document.getElementById("cell-" + index + "-" + 4)
            if (workerCell.classList.contains("red")) {
                isValid = false
            }
        });
        var warningMsg = ""
        // console.log("isValid")
        // console.log(isValid)
        if (!isValid) {
            setErrorMsg(defaultErrorMsg)
            errorModal.show()
            return
        } else {
            if (initialAppliesToReqs && !doesApply(user.currentRequestArray, sumShifts.current)) {
                warningMsg += "- The previous allocation of employees meets the requirements, whereas the current one does not."
            }
            if (((costKpi + wastedHoursKpi) > (initialCost.current + intialWastedHours.current))) {
                if (warningMsg != "") {
                    warningMsg += "\n"
                }
                warningMsg += "- Average of the measures has been reduced."
            }
            if (warningMsg != "") {
                warningMsg += "\nDo you want to continue?"
                setWarningMsg(warningMsg)
                warningModal.show()
            } else {
                saveModal.show()
            }
        }
    };

    const handleErrorModalClose = () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
        errorModal.hide()
    };

    const handleWarningModalClose = () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('warningModal'));
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
        const map = user.algo1Table
        map.set(utils.getKey(currentDay, currentSkill), content)
        newUser.algo1Table = map
        newUser.tableAlgo1Changed = true
        setWorksPerShift(content)
        await algo1api.postAlgo1Res(content, user.token)
        setUser(newUser)
        setInEdit(false)
        finishCallback()
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
                <div className="row" style={{ position: "fixed", top: "1%", height: "3%" }}>
                    <div className="col-12">
                        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#backModal" onClick={handleBack}>Back</button>
                        <span style={{ position: "fixed", left: "9.7%", top: "1%" }}><Kpi name={"Cost"} value={costKpi} initialValue={initialCost.current} description={"Total cost of shifts where day is " + initialTable[0][0] + " and skill is " + initialTable[0][1]} maxWidth={"30.8vw"}></Kpi></span>
                        <span style={{ position: "fixed", left: "41.5%", top: "1%" }}><Kpi name={"Wasted Hours"} value={wastedHoursKpi} initialValue={intialWastedHours.current} description={"Total wasted hours as there are more assigned workers than the demand at some half hour where day is " + initialTable[0][0] + " and skill is " + initialTable[0][1]} maxWidth={"30.8vw"}></Kpi></span>
                        <span style={{ position: "fixed", left: "73.3%", top: "1%" }}><Kpi name={"Avg"} value={(costKpi + wastedHoursKpi) / 2} initialValue={(intialWastedHours.current + initialCost.current) / 2} description={"Average of the measures where day is " + initialTable[0][0] + " and skill is " + initialTable[0][1]} maxWidth={"25.7vw"}></Kpi></span>
                    </div>
                </div>


                <div style={{ position: "fixed", top: "10%", left: "0", right: "0", bottom: "15%", overflowY: "auto", maxHeight: "75%" }}>
                    <Table content={content} onCellEdit={handleCellEdit} isNumberOfWorkersValid={isNumberOfWorkersValid} rowsToRender={rowsToRender} />
                </div>

                <div style={{ position: "fixed", bottom: "5%", left: "50%", transform: "translateX(-50%)" }}>
                    <button className="btn btn-success" onClick={handleSave} style={{ fontSize: "2.2vh", width: "150px" }}>
                        Save
                    </button>
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
                <div className="modal fade show modal-success" id="saveModal" tabIndex="-1" role="dialog" aria-labelledby="saveModal" aria-hidden="true" onHide={handleSuccessModalClose}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content modal-success">
                            <div className="modal-header">
                                <h5 className="modal-title text-success" id="saveModalLongTitle">Success!</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-success">
                                Your changes have been saved successfully.
                            </div>
                            <div className="modal-footer">
                                <div className="col-4" />
                                <div className="col-2">
                                    <button type="button" className="btn btn-success" data-dismiss="modal" onClick={finishEdit}>Finish</button>
                                </div>
                                <div className="col-2">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Keep Editing</button>
                                </div>
                                <div className="col-4" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {true && (
                <div className="modal fade show modal-warning" id="warningModal" tabIndex="-1" role="dialog" aria-labelledby="saveModal" aria-hidden="true" onHide={handleWarningModalClose}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content modal-warning">
                            <div className="modal-header">
                                <h5 className="modal-title text-warning" id="saveModalLongTitle">Warning!</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-warning" style={{ whiteSpace: 'pre-wrap' }}>
                                {warningMsg}
                            </div>
                            <div className="modal-footer">
                                <div className="col-4" />
                                <div className="col-2">
                                    <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={finishEdit}>Finish</button>
                                </div>
                                <div className="col-2">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Keep Editing</button>
                                </div>
                                <div className="col-4" />
                            </div>
                        </div>
                    </div>
                </div>
            )}



        </div>)
}