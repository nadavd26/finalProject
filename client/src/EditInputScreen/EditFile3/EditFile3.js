import { useEffect, useState } from "react";
import Table from "./Table";
import '../css/bootstrap.min.css'
import '../css/edit-file-table-main.css'
import '../css/perfect-scrollbar.css'
import { postInputTable } from "../../api/InputTableApi";
import { csv_to_array, parseTime, isCostValid, isSkillValid } from "../Utils";
import { sortTable } from "../../api/InputTableApi";

export default function EditFile3({ csvArray, setEditInfo, user, setUser, fromServer }) {
    const [content, setContent] = useState([["", "", "", "", ""]])
    const [errors, setErrors] = useState([[true, true, true, true, true]])
    const [showErrorModel, setShowErrorModel] = useState(false)
    const [showSuccessModel, setShowSuccessModel] = useState(false)
    const [showBackModal, setShowBackModal] = useState(false)
    const [rowsToRender, setRowsToRender] = useState({})
    const defaultErrorMsg = "The table must contain at least one line.\n" +
        "Skill contains only letters, spaces, apostrophes, and certain special characters.\n" +
        "Cost is a non-negative integer."
    const [errorMsg, setErrorMsg] = useState(defaultErrorMsg)
    const token = user.token
    var errorLines = 0
    const sortTableWithErrors = async (table) => {
        const validTable = table.slice(errorLines, table.length)
        const sortedTable = await sortTable(3, validTable, user.token)
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
        const errorsFound = Array.from({ length: table.length }, () => Array(5).fill(false));
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
            if (table[i].length != 5) {
                isValid = false
                setEditInfo({ inEdit: false, errorMsg: "The table must be 5 columns" })
                return
            }

            const skill = table[i][0]
            if (!isSkillValid(skill)) {
                // isValid = false
                // errorsFound[i][1] = true
                // errorMsg += "line " + (i + 1) + " column 2 " + "invalid skill" + "\n"
                handleError(i, 0)
            }

            table[i][1] = (table[i][1]).toLowerCase()
            const day = table[i][1]
            if (day != "sunday" && day != "monday" && day != "tuesday" && day != "wednesday" && day != "thursday" && day != "friday" && day != "saturday") {
                // isValid = false
                // swap_lines(i, errorLines)
                // errorLines++
                // errorsFound[i][0] = true
                handleError(i, 1)
                errorMsg += "line " + (i + 1) + " column 1 " + "invalid day" + "\n"
            }

            let fromTimeValid = true
            let untilTimeValid = true
            const from = table[i][2]
            const formatFrom = parseTime(from)
            if (!formatFrom) {
                fromTimeValid = false
                // errorsFound[i][2] = true
                // isValid = false
                // errorMsg += "line " + (i + 1) + " column 3 " + "invalid from hour" + "\n"
                handleError(i, 2)
            } else {
                table[i][2] = formatFrom
            }
            if (fromTimeValid) {
                if (formatFrom[4] != "0" || (formatFrom[3] != "0" && formatFrom[3] != "3")) {
                    // errorMsg += "line " + (i + 1) + " column 3 " + "time interval is 30 minutes" + "\n"
                    // isValid = false
                    // errorsFound[i][2] = true
                    handleError(i, 2)
                }

                if (formatFrom < "00:00") {
                    // errorMsg += "line " + (i + 1) + " column 3 " + "min from time is 00:00" + "\n"
                    // isValid = false
                    // errorsFound[i][2] = true
                    handleError(i, 2)
                }

                if (formatFrom > "23:30") {
                    // errorMsg += "line " + (i + 1) + " column 3 " + "max from time is 23:30" + "\n"
                    // isValid = false
                    // errorsFound[i][2] = true
                    handleError(i, 2)
                }
            }

            const until = table[i][3]
            const formatUntil = parseTime(until)
            if (!formatUntil) {
                // isValid = false
                untilTimeValid = false
                // errorsFound[i][3] = true
                // errorMsg += "line " + (i + 1) + " column 4 " + "invalid until hour" + "\n"
                handleError(i, 3)
            } else {
                table[i][3] = formatUntil
            }

            if (untilTimeValid) {
                if (formatUntil[4] != "0" || (formatUntil[3] != "0" && formatUntil[3] != "3")) {
                    // errorMsg += "line " + (i + 1) + " column 4 " + "time interval is 30 minutes" + "\n"
                    // errorsFound[i][3] = true
                    handleError(i, 3)
                }

                if (formatUntil > "24:00") {
                    // errorMsg += "line " + (i + 1) + " column 4 " + "max until time is 24:00" + "\n"
                    // isValid = false
                    // errorsFound[i][3] = true
                    handleError(i, 3)
                }

                if (formatUntil < "00:30") {
                    // errorMsg += "line " + (i + 1) + " column 4 " + "min until time is 00:30" + "\n"
                    // isValid = false
                    // errorsFound[i][3] = true
                    handleError(i, 3)
                }

                if (fromTimeValid && formatFrom >= formatUntil) {
                    // errorMsg += "line " + (i + 1) + " column 3 and 4 " + "until time is before or equal from time" + "\n"
                    // isValid = false
                    // errorsFound[i][3] = true
                    handleError(i, 3)
                    errorsFound[i][2] = true
                }
            }

            const cost = table[i][4]
            const modifiedCost = parseInt(cost)
            if (!isCostValid(modifiedCost)) {
                // isValid = false
                // errorsFound[i][4] = true
                // errorMsg += "line " + (i + 1) + " column 5 " + "invalid number of workers" + "\n"
                handleError(i, 4)
            } else {
                table[i][4] = modifiedCost
            }

            if (!isValid) {
                handleLineError(i)
            }
        }

        if (errorLines != table.length) {
            const newTable = await sortTableWithErrors(table)
            setContent(newTable)
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
        const newRow = ["", "", "", "", ""]
        const newErrorRow = [true, true, true, true, true]
        var newRowsToRender = {}
        for (let i = 0; i < content.length; i++) {
            console.log("render all")
            newRowsToRender[i] = true
        }

        setRowsToRender(newRowsToRender)
        setContent((prevContent) => [...prevContent, newRow]);
        setErrors((prevErrors) => [...prevErrors, newErrorRow]);
    };

    const onRowAdd = (rowIndex) => {
        const newEmptyRow = [content[rowIndex][0], content[rowIndex][1], "00:00", "24:00", ""];
        const newErrorRow = [errors[rowIndex][0], errors[rowIndex][1], false, false, true];
        var newRowsToRender = {}
        for (let i = 0; i < content.length; i++) {
            console.log("render all")
            newRowsToRender[i] = true
        }

        setRowsToRender(newRowsToRender)
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
        const updatedContent = content.map((row, i) => {
            if (i === rowIndex) {
                return row.map((cell, j) => (j === columnIndex ? value : cell));
            } else {
                return row;
            }
        });

        var updatedErrors
        switch (columnIndex) {
            case 0:
                updatedErrors = errors.map((row, i) => {
                    if (i === rowIndex) {
                        return row.map((cell, j) => (j === columnIndex ? !isSkillValid(updatedContent[i][j]) : cell));
                    } else {
                        return row;
                    }
                });
                break; // Add break statement here

            case 4:
                updatedErrors = errors.map((row, i) => {
                    if (i === rowIndex) {
                        return row.map((cell, j) => (j === columnIndex ? !isCostValid(updatedContent[i][j]) : cell));
                    } else {
                        return row;
                    }
                });
                break; // Add break statement here

            default:
                updatedErrors = errors.map((row, i) => {
                    if (i === rowIndex) {
                        return row.map((cell, j) => (j === columnIndex ? false : cell));
                    } else {
                        return row;
                    }
                });
                break; // Add break statement here
        }
        var newRowsToRender = {}
        newRowsToRender[rowIndex] = true
        setRowsToRender(newRowsToRender)
        setContent(updatedContent);
        setErrors(updatedErrors)
    };


    const calcOverlaps = (table) => {
        let overlaps = []
        for (let i = 0; i < table.length - 1; i++) {
            if (table[i][0] == table[i + 1][0] && table[i][1] == table[i + 1][1] && table[i][2] == table[i + 1][2] && table[i][3] == table[i + 1][3]) {
                if (overlaps[overlaps.length - 1] != i + 1) {
                    overlaps.push(i + 1)
                }

                overlaps.push(i + 2)
            }
        }

        return overlaps
    }
    const handleSave = async () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
        const saveModal = new window.bootstrap.Modal(document.getElementById('saveModal'));

        var isValid = true;
        if (content.length === 0) {
            isValid = false;
        }

        for (let i = 0; i < content.length; i++) {
            for (let j = 0; j <= 4; j++) {
                const cell = document.getElementById(`cell-${(i)}-${j}`)
                cell.classList.remove("pink")
            }
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
        }
        const sortedTable = await sortTable(3, content, user.token);
        var newRowsToRender = {}
        for (let i = 0; i < content.length; i++) {
            newRowsToRender[i] = true
        }

        setRowsToRender(newRowsToRender)
        setContent(sortedTable)
        const overlaps = calcOverlaps(sortedTable)
        if (overlaps.length != 0) {
            overlaps.forEach(row => {
                for (let j = 0; j <= 4; j++) {
                    const cell = document.getElementById(`cell-${(row - 1)}-${j}`)
                    cell.classList.add("pink")
                }
            })
            setErrorMsg("detected overlaps in rows: \n" + JSON.stringify(overlaps))
            errorModal.show()
        } else {
            saveModal.show()
        }



        // if (isValid) {
        //     // Perform sorting operation

        //     if (sortedTable.length % 2 === 1) {
        //         // Update content state after sorting
        //         setContent(sortedTable);

        //         // Show success modal
        //         setShowSuccessModel(true);
        //         setShowErrorModel(false);
        //     } else {
        //         // Show error modal
        //         setShowSuccessModel(false);
        //         setShowErrorModel(true);
        //     }
        // } else {
        //     // Show error modal if the data is not valid
        //     setShowSuccessModel(false);
        //     setShowErrorModel(true);
        // }
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

            var newRowsToRender = {}
            for (let i = 0; i < content.length; i++) {
                newRowsToRender[i] = true
            }

            setRowsToRender(newRowsToRender)
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
        await postInputTable(3, content, token)
        setEditInfo({ inEdit: false, errorMsg: "" })
        var newUser = user
        newUser.table3 = content
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
                <Table content={content} onCellEdit={handleCellEdit} onRowDelete={deleteRow} errors={errors} onRowAdd={onRowAdd} rowsToRender={rowsToRender}></Table>
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