import { useEffect, useState } from "react";
import Table from "./Table";
import '../css/bootstrap.min.css'
import '../css/edit-file-table-main.css'
import '../css/perfect-scrollbar.css'
import * as utils from '../../Utils'
import Kpi from "../components/Kpi";

export default function EditResFile1({ initialTable, setInEdit, user, setUser, currentDay, currentSkill, setWorksPerShift, finishCallback }) {
    const [content, setContent] = useState([["", "", "", "", ""]])
    const [showBackModal, setShowBackModal] = useState(false)
    const defaultErrorMsg = "Assigned Number Of Workers is a non-negative integer."
    const [errorMsg, setErrorMsg] = useState(defaultErrorMsg)
    const [rowsToRender, setRowsToRender] = useState({})
    var intialWastedHours = user.currentWastedHours
    const [wastedHoursKpi, setWastedHoursKpi] = useState(user.currentWastedHours)
    const [initialCost, setInitialCost] = useState(0)
    const [costKpi, setCostKpi] = useState(0)
    const token = user.token
    console.log("key isssssssssss : " + currentDay + "******" + currentSkill)
    function isNumberOfWorkersValid(numOfWorkers) {
        if (numOfWorkers === "") {
            return false
        }
        const parsedValue = Number(numOfWorkers);
        return Number.isInteger(parsedValue) && parsedValue >= 0;
    };

    function calcCost() {
        var cost = 0
        for (let i = 0; i < initialTable.length; i++) {
            var costShift = initialTable[i][5]
            cost = cost + (costShift * initialTable[i][4])
        }
        console.log("cost")
        console.log(cost)
        return cost
    }

    useEffect(() => {
        setContent(initialTable.map(row => [...row]))
        var newRowsToRender = {}
        for (let i = 0; i < initialTable.length; i++) {
            newRowsToRender[i] = true
        }
        setRowsToRender(newRowsToRender)
        var initCost = calcCost()
        setInitialCost(initCost)
        setCostKpi(initCost)
    }, []);

    const hourToIndex = (hour) => {
        if (typeof hour !== 'string') {
            // Handle the case where hour is not a string
            return -1; // or any other default value
        }
        const [hours, minutes] = hour.split(':');
        return hours * 2 + (minutes === '30' ? 1 : 0);
    };
    
    // Convert hours to array number
    const hoursToArrayNumber = (startHour, endHour, num) => {
        const start = hourToIndex(startHour);
        let end = hourToIndex(endHour);
        if (end === 0) {
            end = 48;
        }
        const hoursArray = Array.from({ length: 48 }, (_, i) => (start <= i && i < end) ? num : 0);
        return hoursArray;
    };
    
    const computeWastedHours = (reqs, line) => {
        console.log("reqs")
        console.log(reqs)
        console.log("line")
        console.log(line)
        var shiftsArray = hoursToArrayNumber(line[2], line[3], parseInt(line[4]))
        let sum = 0;
        for(let i = 0; i < 48; i++)
            sum += Math.max(0, shiftsArray[i] - reqs[i])
        return sum / 2
    }

    const handleCellEdit = (rowIndex, columnIndex, value, oldValue) => {
        console.log("value")
        console.log(value)
        console.log("oldValue")
        console.log(oldValue)
        var updatedContent = content
        var price = updatedContent[rowIndex][5]
        updatedContent[rowIndex][columnIndex] = value
        setCostKpi(prevCostKpi => prevCostKpi - (price * (oldValue - value))); // Functional update
        var newRow = updatedContent[rowIndex]
        var oldRow = [...newRow]
        oldRow[4] = oldValue
        var wastedHoursReduce = computeWastedHours(user.currentRequestArray, oldRow)
        var wastedHoursAdd = computeWastedHours(user.currentRequestArray, newRow)
        setWastedHoursKpi(prevWastedHours => prevWastedHours - wastedHoursReduce + wastedHoursAdd)
        var newRowsToRender = {}
        newRowsToRender[rowIndex] = true
        setRowsToRender(newRowsToRender)
        setContent(updatedContent);
        console.log("content")
        console.log(content)
    };


    const handleSave = async () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
        const saveModal = new window.bootstrap.Modal(document.getElementById('saveModal'));

        var isValid = true;
        if (content.length === 0) {
            isValid = false;
        }
        content.forEach((row) => {
            if (!(isNumberOfWorkersValid(row[4]))) {
                isValid = false
            }
        });

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
        const map = user.algo1Table
        map.set(utils.getKey(currentDay, currentSkill), content)
        newUser.algo1Table = map
        setWorksPerShift(content)
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
                        <span style={{ position: "fixed", left: "9.7%", top: "1%" }}><Kpi name={"Cost"} value={costKpi} initialValue={initialCost} description={"Total cost of shifts where day is " + initialTable[0][0] + " and skill is " + initialTable[0][1]}></Kpi></span>
                        <span style={{ position: "fixed", left: "41.5%", top: "1%" }}><Kpi name={"Wasted Hours"} value={wastedHoursKpi} initialValue={intialWastedHours} description={"Total wasted hours as there are more assigned workers than the demand at some half hour where day is " + initialTable[0][0] + " and skill is " + initialTable[0][1]}></Kpi></span>
                        <span style={{ position: "fixed", left: "73.3%", top: "1%" }}><Kpi name={"Avg"} value={(costKpi + wastedHoursKpi) / 2} initialValue={(intialWastedHours + initialCost) / 2} description={"Average of the measures where day is " + initialTable[0][0] + " and skill is " + initialTable[0][1]}></Kpi></span>
                    </div>
                </div>
                <Table content={content} onCellEdit={handleCellEdit} isNumberOfWorkersValid={isNumberOfWorkersValid} rowsToRender={rowsToRender}></Table>
                <div className="row down-buttons" style={{ position: "fixed", top: "90%", width: "100%" }}>
                    <div className="col-4">
                    </div>
                    <button className="btn btn-success col-4" onClick={handleSave}
                        data-toggle="modal" style={{ fontSize: "2.7vh" }}>Save</button>
                    <div className="col-4">
                    </div>
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
                <div className={`modal fade show ${((costKpi + wastedHoursKpi) > (initialCost + intialWastedHours)) ? 'modal-warning' : 'modal-success'}`} id="saveModal" tabIndex="-1" role="dialog" aria-labelledby="saveModal" aria-hidden="true" onHide={handleSuccessModalClose}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className={`modal-content ${(costKpi + wastedHoursKpi) > (initialCost + intialWastedHours) ? 'modal-warning' : 'modal-success'}`}>
                            <div className="modal-header">
                                <h5 className={`modal-title ${(costKpi + wastedHoursKpi) > (initialCost + intialWastedHours) ? 'text-warning' : 'text-success'}`} id="saveModalLongTitle">{((costKpi + wastedHoursKpi) > (initialCost + intialWastedHours)) ? 'Warning!' : 'Success!'}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className={`modal-body ${(costKpi + wastedHoursKpi) > (initialCost + intialWastedHours) ? 'text-warning' : 'text-success'}`}>
                                {((costKpi + wastedHoursKpi) >= (initialCost + intialWastedHours)) ?
                                    "Avg of the measures has been reduced, do you want to save the changes?" :
                                    "Your changes have been saved successfully."
                                }
                            </div>
                            <div className="modal-footer">
                                <div className="col-4" />
                                <div className="col-2">
                                <button type="button" className={`btn ${((costKpi + wastedHoursKpi) > (initialCost + intialWastedHours)) ? 'btn-warning' : 'btn-success'}`} data-dismiss="modal" onClick={finishEdit}>Finish</button>
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