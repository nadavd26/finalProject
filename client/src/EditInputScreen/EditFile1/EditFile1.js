import { useEffect, useState } from "react";
import Table from "./Table";
import '../css/bootstrap.min.css'
import '../css/edit-file-table-main.css'
import '../css/perfect-scrollbar.css'
import { postInputTable } from "../../api/InputTableApi";
import { csv_to_array, parseTime, isNumberOfWorkersValid, isSkillValid, isIdValid, isNameValid, isContractValid } from "../Utils";
import { sortTable } from "../../api/InputTableApi";

export default function EditFile1({ csvArray, setEditInfo, user, setUser, fromServer }) {
    const [content, setContent] = useState([["", "", "", "", "", ""]])
    const [errors, setErrors] = useState([[true, true, true, false, false, true]])
    const [showErrorModel, setShowErrorModel] = useState(false)
    const [showSuccessModel, setShowSuccessModel] = useState(false)
    const [showBackModal, setShowBackModal] = useState(false)
    const defaultErrorMsg = "The table must contain at least one line.\n" +
        "Id must contain only digits.\n " +
        "Skills contain only letters, spaces, apostrophes, and certain special characters.\n" +
        "Duplicates between skills are not alowed.\n" +
        "Skill cannot be empty if the next skill is not empty.\n" +
        "Must have at least one skill.\n" +
        "Contract is a non-negative integer."
    const [errorMsg, setErrorMsg] = useState(defaultErrorMsg)
    const token = user.token
    var errorLines = 0
    const sortTableWithErrors = async (table) => {
        const validTable = table.slice(errorLines, table.length)
        const sortedTable = await sortTable(1, validTable, user.token)
        const newTable = [...table.slice(0, errorLines), ...sortedTable]
        return newTable
    }
    const initAndCheck = async (table) => {
        const table_swap_lines = (i, j) => {
            const tmp = table[i]
            table[i] = table[j]
            table[j] = tmp
        }
        let errorMsg = ""
        let isValid = true
        const errorsFound = Array.from({ length: table.length }, () => Array(6).fill(false));
        const errors_swap_lines = (i, j) => {
            const tmp = errorsFound[i]
            errorsFound[i] = errorsFound[j]
            errorsFound[j] = tmp
        }
        const handleLineError = (i) => {
            table_swap_lines(i, errorLines)
            errors_swap_lines(i, errorLines)
            errorLines = errorLines + 1
        }

        const handleError = (i, j) => {
            isValid = false
            errorsFound[i][j] = true
        }
        for (let i = 0; i < table.length; i++) {
            isValid = true
            if (table[i].length != 6) {
                isValid = false
                setEditInfo({ inEdit: false, errorMsg: "The table must be 6 columns" })
                return
            }
            const id = table[i][0]
            if (!isIdValid(id)) {
                handleError(i, 0)
                errorMsg += "line " + (i + 1) + " column 1 " + "invalid day" + "\n"
            } else {
                table[i][0] = id
            }

            const name = table[i][1]
            if (!isNameValid(name)) {
                handleError(i, 1)
            }

            const skill1 = table[i][2]
            const skill2 = table[i][3]
            const skill3 = table[i][4]

            if (!isSkillValid(skill1)) {
                handleError(i, 2)
            }

            if ((!isSkillValid(skill2) && skill2 != "") || (skill2 == skill1)) {
                handleError(i, 3)
            }

            if ((!isSkillValid(skill3) && skill3 != "") || (skill3 == skill2) || (skill3 == skill1)) {
                handleError(i, 4)
            }

            if (skill3 != "") {
                if (skill2 == "") {
                    handleError(i, 3)
                }

                if (skill1 == "") {
                    handleError(i, 2)
                }
            }

            const contract = table[i][5]
            if (!isContractValid(contract)) {
                handleError(i, 5)
            }

            if (!isValid) {
                handleLineError(i)
            }
        }

        if (errorLines != table.length) {
            const newTable = await sortTableWithErrors(table)
            setContent(newTable)
            setContent(table)
        } else {
            setContent(table)
        }
        setErrors(errorsFound)
    }


    useEffect(() => {
        if (csvArray.length > 0 && fromServer == false) {
            initAndCheck(csvArray);
        }

        if (fromServer == true) {
            setContent(csvArray)
            const falseArray = Array.from({ length: csvArray.length }, () =>
                Array.from({ length: csvArray[0].length }, () => false)
            );

            setErrors(falseArray)
        }
    }, [csvArray, setContent]);

    const addRowHandler = () => {
        const newRow = ["", "", "", "", "", ""]
        const newErrorRow = [true, true, true, false, false, true]
        setContent((prevContent) => [...prevContent, newRow]);
        setErrors((prevErrors) => [...prevErrors, newErrorRow]);
    };

    const onRowAdd = (rowIndex) => {
        const newEmptyRow = ["", "", "", "", "", ""];
        const newErrorRow = [true, true, true, false, false, true];

        setContent((prevContent) => {
            const newContent = [...prevContent];
            newContent.splice(rowIndex + 1, 0, newEmptyRow);
            return newContent;
        });

        setErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors.splice(rowIndex + 1, 0, newErrorRow);
            return newErrors;
        });
    }

    const handleCellEdit = (rowIndex, columnIndex, value) => {
        var oldValue = content[rowIndex][columnIndex]
        const updatedContent = content.map((row, i) => {
            if (i === rowIndex) {
                return row.map((cell, j) => (j === columnIndex ? value : cell));
            } else {
                return row;
            }
        });

        const skill1 = updatedContent[rowIndex][2]
        const skill2 = updatedContent[rowIndex][3]
        const skill3 = updatedContent[rowIndex][4]

        var updatedErrors
        switch (columnIndex) {
            case 0: //id
                updatedErrors = errors.map((row, i) => {
                    if (i === rowIndex) {
                        return row.map((cell, j) => (j === columnIndex ? !isIdValid(updatedContent[i][j]) : cell));
                    } else {
                        return row;
                    }
                });
                break;

            case 1: //name
                updatedErrors = errors.map((row, i) => {
                    if (i === rowIndex) {
                        return row.map((cell, j) => (j === columnIndex ? !isNameValid(updatedContent[i][j]) : cell));
                    } else {
                        return row;
                    }
                });
                break;
            case 2: //skill1
                updatedErrors = errors.map((row, i) => {
                    if (i === rowIndex) {
                        return row.map((cell, j) => (j === columnIndex ? !isSkillValid(updatedContent[i][j]) : cell));
                    } else {
                        return row;
                    }
                });

                if (value != "") {
                    if (value == skill2) {
                        updatedErrors[rowIndex][3] = true
                    }

                    if (value == skill3) {
                        updatedErrors[rowIndex][4] = true
                    }

                    if (value != oldValue && oldValue == skill2) {
                        updatedErrors[rowIndex][3] = (!isSkillValid(skill2) && skill2 != "") || (skill2 == "" && skill3 != "")
                    }

                    if (value != oldValue && oldValue == skill3) {
                        updatedErrors[rowIndex][4] = (!isSkillValid(skill3) && skill3 != "") || ((skill3 == skill2) && (skill3 != ""))
                    }
                } else {
                    updatedErrors[rowIndex][3] = (!isSkillValid(skill2) && skill2 != "") || (skill3 != "" && skill2 == "")
                    updatedErrors[rowIndex][4] = !isSkillValid(skill3) && skill3 != ""
                }

                break;
            case 3: //skill2
                updatedErrors = errors.map((row, i) => {
                    if (i === rowIndex) {
                        return row.map((cell, j) => (j === columnIndex ? updatedContent[i][j] != "" && !isSkillValid(updatedContent[i][j]) : cell));
                    } else {
                        return row;
                    }
                });

                if (value == "") {
                    if (skill3 != "") {
                        updatedErrors[rowIndex][3] = true
                    }
                } else {
                    if (value == skill1) { //duplicate skill
                        updatedErrors[rowIndex][3] = true
                    }

                    if (value == skill3) { //duplicate skill
                        updatedErrors[rowIndex][4] = true
                    }

                    if (value != oldValue && oldValue == skill3) {
                        updatedErrors[rowIndex][4] = (!isSkillValid(skill3) && skill3 != "") || (skill3 == skill1 && skill3 != "")
                    }
                }
                break;
            case 4: //skill3
                updatedErrors = errors.map((row, i) => {
                    if (i === rowIndex) {
                        return row.map((cell, j) => (j === columnIndex ? updatedContent[i][j] != "" && !isSkillValid(updatedContent[i][j]) : cell));
                    } else {
                        return row;
                    }
                });

                if (value != "") {
                    if (updatedContent[rowIndex][3] == "") {
                        updatedErrors[rowIndex][3] = true
                    }

                    if (value == updatedContent[rowIndex][2] || value == updatedContent[rowIndex][3]) { //dupliacte skill
                        updatedErrors[rowIndex][4] = true
                    }
                } else {
                    if (updatedContent[rowIndex][3] == "") {
                        updatedErrors[rowIndex][3] = false
                    }
                }
                break;

            case 5:
                updatedErrors = errors.map((row, i) => {
                    if (i === rowIndex) {
                        return row.map((cell, j) => (j === columnIndex ? !isContractValid(updatedContent[i][j]) : cell));
                    } else {
                        return row;
                    }
                });
                break;
        }

        setContent(updatedContent);
        setErrors(updatedErrors)
    };

    const findDuplicatesId = (sortedTable) => {
        var dupliactes = []
        for (let i = 0; i < sortedTable.length - 1; i++) {
            if (sortedTable[i][0] == sortedTable[i + 1][0]) {
                if (dupliactes[dupliactes.length - 1] != i + 1) {
                    dupliactes.push(i + 1)
                }

                dupliactes.push(i + 2)
            }
        }

        return dupliactes
    }

    const handleSave = async () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
        const saveModal = new window.bootstrap.Modal(document.getElementById('saveModal'));

        var isValid = true;
        if (content.length === 0) {
            isValid = false;
        }
        errors.forEach((row) => {
            row.forEach((cell) => {
                if (cell) {
                    isValid = false;
                }
            });
        });

        if (!isValid) {
            setErrorMsg(defaultErrorMsg)
            errorModal.show()
            return
        } else {
            const sortedTable = await sortTable(1, content, user.token);
            setContent(sortedTable)
            const duplicatesId = findDuplicatesId(sortedTable)
            if (duplicatesId.length != 0) {
                setErrorMsg("Dupliacted Id's in rows: " + JSON.stringify(duplicatesId))
                errorModal.show()
            } else {
                saveModal.show()
            }
        }
    };




    const deleteRow = (rowIndex) => {
        if (rowIndex >= 0 && rowIndex < content.length) {
            setContent((prevContent) => {
                const newContent = [...prevContent];
                newContent.splice(rowIndex, 1);
                return newContent;
            })

            setErrors((prevErrors) => {
                const newErrors = [...prevErrors];
                newErrors.splice(rowIndex, 1);
                return newErrors;
            })
        };
    }

    const handleErrorModalClose = () => {
        setShowErrorModel(false);
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModel(false);
    };

    const handleBackModalClose = () => {
        setShowBackModal(false)
    }

    const finishEdit = async () => {
        await postInputTable(1, content, token)
        setEditInfo({ inEdit: false, errorMsg: "" })
        var newUser = user
        newUser.table1 = content
        setUser(newUser)
    };

    const handleBack = () => {
        setShowBackModal(true)
    }

    const handleExit = () => {
        setEditInfo({ inEdit: false, errorMsg: "" })
    }

    return (
        <div id="edit-file">
            <div className="container-fluid py-3">
                <div className="col-1">
                    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#backModal" onClick={handleBack}>Back</button>
                </div>
                <div className="col-11"></div>
                <Table content={content} onCellEdit={handleCellEdit} onRowDelete={deleteRow} errors={errors}
                    isNumberOfWorkersValid={isNumberOfWorkersValid} isSkillValid={isSkillValid} onRowAdd={onRowAdd}></Table>
                <div className="row"><br /></div>
                <div className="d-flex justify-content-between mb-3 down-buttons">
                    <div className="col-3"></div>
                    <button className="btn btn-success col-3" onClick={handleSave}
                        data-toggle="modal" >Save</button>
                    <button className="btn btn-secondary col-3" onClick={addRowHandler} >Add Row</button>
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