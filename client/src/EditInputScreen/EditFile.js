import { useState } from "react";
import Table from "./components/Table";
import './css/bootstrap.min.css'
import './css/edit-file-table-main.css'
import './css/perfect-scrollbar.css'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

function EditFile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { numOfFile } = location.state
    const [content, setContent] = useState([["Sunday", "", "06:00", "23:00", ""]])
    const [showErrorModel, setShowErrorModel] = useState(false)
    const [showSuccessModel, setShowSuccessModel] = useState(false)
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
        const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9@'",.!?]*$/;
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

    const finishEdit = () => {
        content.forEach((row) => {
            console.log(row.join(', '))
        })
        navigate("/upload")
    };

    return (
        <div id="edit-file">
            <div className="container-fluid py-3">
                <Table content={content} onCellEdit={handleCellEdit} onRowDelete={deleteRow} onRowAdd={addRow}
                    isNumberOfWorkersValid={isNumberOfWorkersValid} isSkillValid={isSkillValid}></Table>
                <div className="row"><br /></div>
                <div className="d-flex justify-content-between mb-3 down-buttons">
                    <div className="col-3"></div>
                    <button className="btn btn-success col-3" onClick={handleSave}
                        data-toggle="modal" data-target="#exampleModalCenter">Save</button>
                    <button className="btn btn-secondary col-3" onClick={addRowHandler} >Add Row</button>
                    <div className="col-3"></div>
                </div>
            </div>
            {showErrorModel && (
                <div class="modal fade show" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" onHide={handleErrorModalClose}>
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content modal-danger"> {/* Add custom class modal-danger */}
                            <div class="modal-header">
                                <h5 class="modal-title text-danger" id="exampleModalLongTitle">Cannot Save Changes</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-danger"> {/* Add text-danger for red text */}
                                Error.<br></br>
                                The table must contain at least one line.<br></br>
                                Skill contains only English characters (at least one), numbers, and some special characters.<br></br>
                                Required Number Of Workers is a non-negative integer.
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Go Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showSuccessModel && (
                <div class="modal fade show" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" onHide={handleSuccessModalClose}>
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content modal-success"> {/* Add custom class modal-success */}
                            <div class="modal-header">
                                <h5 class="modal-title text-success" id="exampleModalLongTitle">Changes Saved Successfully</h5>
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
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={finishEdit}>Finish</button>
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