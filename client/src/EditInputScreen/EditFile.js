import { useEffect, useState } from "react";
import Table from "./components/Table";
import './css/bootstrap.min.css'
import './css/edit-file-table-main.css'
import './css/perfect-scrollbar.css'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import Papa from 'papaparse';

function EditFile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { numOfFile, file } = location.state
    const [content, setContent] = useState([["Sunday", "", "06:00", "23:00", ""]])
    const [showErrorModel, setShowErrorModel] = useState(false)
    const [showSuccessModel, setShowSuccessModel] = useState(false)
    const [showBackModal, setShowBackModal] = useState(false)

    const csv_to_array = (data, delimiter = ',', omitFirstRow = false) => {
        const lines = data.split('\n');
        const startFrom = omitFirstRow ? 1 : 0;
        const result = [];
        for (let i = startFrom; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.length === 0) {
                continue;
            }
            const values = line.split(delimiter);
            result.push(values);
        }
        return result;
    };

    function parseTime(inputTime) {
        const trimmedTime = inputTime.trim(); 
        const timeComponents = trimmedTime.split(':');
        let hours, minutes;
        if (timeComponents.length === 2) {
            hours = parseInt(timeComponents[0]);
            minutes = parseInt(timeComponents[1]);
        } else if (timeComponents.length === 1 && trimmedTime.length >= 3) {
            hours = 0;
            minutes = parseInt(timeComponents[0]);
        } else {
            return null
        }
        if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return null
        }
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}`;
    }

    const initAndCheck = (table) => {
        let errorMsg = ""
        let isValid = true
        for (let i = 0; i < table.length; i++) {
            if (table[i].length != 5) {
                isValid = false
                errorMsg += "line " + (i + 1) + " invalid line length (must be 5)" + "\n"
            }
            table[i][0] = (table[i][0]).toLowerCase()
            const day = table[i][0]
            if (day != "sunday" && day != "monday" && day != "tuesday" && day != "wednesday" && day != "thursday" && day != "friday" && day != "saturday") {
                isValid = false
                errorMsg += "line " + (i + 1) + " column 1 " + "invalid day" + "\n"
            }

            const skill = table[i][1]
            if (!isSkillValid(skill)) {
                isValid = false
                errorMsg += "line " + (i + 1) + " column 2 " + "invalid skill" + "\n"
            }

            const from = table[i][2]
            const formatFrom = parseTime(from)
            if (!formatFrom) {
                isValid = false
                errorMsg += "line " + (i + 1) + " column 3 " + "invalid from hour" + "\n"
            } else {
                table[i][2] = formatFrom
            }

            const until = table[i][3]
            const formatUntil = parseTime(until)
            if (!formatUntil) {
                isValid = false
                errorMsg += "line " + (i + 1) + " column 4 " + "invalid until hour" + "\n"
            } else {
                table[i][3] = formatUntil
            }

            const numOfWorkers = table[i][4]
            const modifiedNumOfWorkers = parseInt(numOfWorkers)
            if (isNaN(modifiedNumOfWorkers)) {
                isValid = false
                errorMsg += "line " + (i + 1) + " column 5 " + "invalid number of workers" + "\n"
            } else {
                table[i][4] = modifiedNumOfWorkers
            }
        }

        console.log("errorMsg = " + errorMsg)
        if (!isValid) {
            return null
        }
        return table
    }

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csv_data = e.target.result;
                const csv_array = initAndCheck(csv_to_array(csv_data, ',', false));
                if (!csv_array) {
                    console.log("problem")
                } else {
                    setContent(csv_array);
                    csv_array.forEach((line, index) => {
                        console.log(`Line ${index + 1}:`, line);
                    });
                }
                console.log("data is:", csv_array);
                // Log every line              
            };
            reader.readAsText(file);
        }
    }, [file, setContent]);


    const addRowHandler = () => {
        const newRow = ["Sunday", "", "06:00", "23:00", ""]
        setContent((prevContent) => [...prevContent, newRow]);
    };

    const handleCellEdit = (rowIndex, columnIndex, value) => {
        const updatedContent = content.map((row, i) => {
            if (i === rowIndex) {
                return row.map((cell, j) => (j === columnIndex ? value : cell));
            } else {
                return row;
            }
        });
        setContent(updatedContent);
    };


    const isNumberOfWorkersValid = (numOfWorkers) => {
        if (numOfWorkers === "") {
            return false
        }
        const parsedValue = Number(numOfWorkers);
        return Number.isInteger(parsedValue) && parsedValue >= 0;
    };

    function isSkillValid(input) {
        const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9@'",.!? ]*$/;
        return regex.test(input);
    }

    const handleSave = () => {
        var valid = true
        if (content.length === 0) {
            valid = false
        }
        content.forEach((row) => {
            if (!isSkillValid(row[1]) || !isNumberOfWorkersValid(row[4])) {
                valid = false
            }
        });
        setShowErrorModel(!valid)
        setShowSuccessModel(valid)
    };

    const addRow = (rowIndex) => {
        if (rowIndex >= 0 && rowIndex < content.length) {
            const newContent = [...content];
            newContent[rowIndex].deleted = false;
            setContent(newContent);
        } else {
            console.error("Invalid rowIndex for addRow:", rowIndex);
        }
    };

    const deleteRow = (rowIndex) => {
        if (rowIndex >= 0 && rowIndex < content.length) {
            setContent((prevContent) => {
                const newContent = [...prevContent];
                newContent.splice(rowIndex, 1);
                return newContent;
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

    const finishEdit = () => {
        content.forEach((row) => {
            console.log(row.join(', '))
        })
        navigate("/upload")
    };

    const handleBack = () => {
        setShowBackModal(true)
    }

    const handleExit = () => {
        navigate("/upload")
    }

    return (
        <div id="edit-file">
            <div className="container-fluid py-3">
                <div className="col-1">
                    <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#backModal" onClick={handleBack}>Back</button>
                </div>
                <div className="col-11"></div>
                <Table content={content} onCellEdit={handleCellEdit} onRowDelete={deleteRow} onRowAdd={addRow}
                    isNumberOfWorkersValid={isNumberOfWorkersValid} isSkillValid={isSkillValid}></Table>
                <div className="row"><br /></div>
                <div className="d-flex justify-content-between mb-3 down-buttons">
                    <div className="col-3"></div>
                    <button className="btn btn-success col-3" onClick={handleSave}
                        data-toggle="modal" data-target="#saveModal">Save</button>
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
            {showErrorModel && (
                <div class="modal fade show" id="saveModal" tabindex="-1" role="dialog" aria-labelledby="saveModal" aria-hidden="true" onHide={handleErrorModalClose}>
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content modal-danger"> {/* Add custom class modal-danger */}
                            <div class="modal-header">
                                <h5 class="modal-title text-danger" id="saveModalLongTitle">Cannot Save Changes</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-danger"> {/* Add text-danger for red text */}
                                The table must contain at least one line.<br></br>
                                Skill contains only English characters (at least one), numbers, and some special characters.<br></br>
                                Required Number Of Workers is a non-negative integer.
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Go Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showSuccessModel && (
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

export default EditFile;