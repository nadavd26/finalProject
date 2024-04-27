import { useEffect, useState } from "react";
import Table from "./Table";
import '../css/bootstrap.min.css'
import '../css/edit-file-table-main.css'
import '../css/perfect-scrollbar.css'
import * as utils from '../../Utils'

export default function EditResFile1({ initialTable, setInEdit, user, setUser, currentDay, currentSkill, setWorksPerShift, finishCallback}) {
    const [content, setContent] = useState([["", "", "", "", ""]])
    const [showBackModal, setShowBackModal] = useState(false)
    const defaultErrorMsg = "Assigned Number Of Workers is a non-negative integer."
    const [errorMsg, setErrorMsg] = useState(defaultErrorMsg)
    const [rowsToRender, setRowsToRender] = useState({})
    const token = user.token

    console.log("key isssssssssss : " + currentDay + "******" + currentSkill)
    function isNumberOfWorkersValid(numOfWorkers) {
        if (numOfWorkers === "") {
            return false
        }
        const parsedValue = Number(numOfWorkers);
        return Number.isInteger(parsedValue) && parsedValue >= 0;
    };

    useEffect(() => {
        setContent(initialTable)
        var newRowsToRender = {}
        for (let i = 0; i < initialTable.length; i++) {
            newRowsToRender[i] = true
        }

        setRowsToRender(newRowsToRender)
    }, []);

    const handleCellEdit = (rowIndex, columnIndex, value) => {
        const updatedContent = content.map((row, i) => {
            if (i === rowIndex) {
                return row.map((cell, j) => (j === columnIndex ? value : cell));
            } else {
                return row;
            }
        });

        var newRowsToRender = {}
        newRowsToRender[rowIndex] = true
        setRowsToRender(newRowsToRender)
        setContent(updatedContent);
    };


    const handleSave = async () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
        const saveModal = new window.bootstrap.Modal(document.getElementById('saveModal'));

        var isValid = true;
        if (content.length === 0) {
            isValid = false;
        }
        content.forEach((row) => {
            if(!(isNumberOfWorkersValid(row[4]))) {
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
                <div className="col-1">
                    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#backModal" onClick={handleBack}>Back</button>
                </div>
                <div className="col-11"></div>
                <Table content={content} onCellEdit={handleCellEdit} isNumberOfWorkersValid={isNumberOfWorkersValid} rowsToRender={rowsToRender}></Table>
                <div className="row"><br /></div>
                <div className="row down-buttons"  style={{position: "fixed", top: "90%", width: "100%"}}>
                    <div className="col-4"></div>
                    <button className="btn btn-success col-4" onClick={handleSave}
                        data-toggle="modal" >Save</button>
                    <div className="col-4"></div>
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