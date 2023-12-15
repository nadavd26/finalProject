import { useState } from "react";
import Table from "./components/Table";
import './css/bootstrap.min.css'
import './css/edit-file-table-main.css'
import './css/perfect-scrollbar.css'
import { useLocation } from 'react-router-dom';

function EditFile() {
    const location = useLocation();
    const { numOfFile } = location.state
    const [content, setContent] = useState([{ "value": ["", "", "", "", ""], "deleted": false }])
    const isDayValid = (day) => {
        const validDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return validDays.includes(day);
    }

    const isHourValid = (time) => {
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    }

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

    const addRowHandler = () => {
        const newRow = { "value": ["", "", "", "", ""], "deleted": false }
        setContent((prevContent) => [...prevContent, newRow]);
    };

    const handleCellEdit = (rowIndex, columnIndex, value) => {
        const updatedContent = content.map((row, i) => {
            if (i === rowIndex) {
                return {
                    ...row,
                    value: row.value.map((cell, j) => (j === columnIndex ? value : cell)),
                };
            } else {
                return row;
            }
        });
        setContent(updatedContent);
    };


    const handleSave = () => {
        console.log("save content is:");
        content.forEach((row) => {
            console.log(row);
        });
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
        // if (rowIndex >= 0 && rowIndex < content.length) {
        //     setContent((prevContent) => {
        //         const newContent = [...prevContent];
        //         if (newContent[rowIndex].value.every((val) => val === "")) {
        //             newContent.splice(rowIndex, 1);
        //         } else {
        //             newContent[rowIndex].deleted = true;
        //         }
        //         return newContent;
        //     });
        // }
        if (rowIndex >= 0 && rowIndex < content.length) {
            setContent((prevContent) => {
                const newContent = [...prevContent];
                newContent.splice(rowIndex, 1);
                return newContent;
            })
        };
    }


    var firstRow = []
    if (numOfFile == 1) {
        firstRow = [{ name: "Day", validate: isDayValid },
        { name: "Skill", validate: isSkillValid },
        { name: "From", validate: isHourValid },
        { name: "Until", validate: isHourValid }
            , { name: "Required Number Of Workers", validate: isNumberOfWorkersValid }]
    }

    return (
        <div id="edit-file">
            <div className="container-fluid py-3">
                <div className="d-flex justify-content-between mb-3 top-buttons">
                    <div className="col-1"></div>
                    <button className="btn btn-secondary col-4">Amount of employees required for each shift</button>
                    <button className="btn btn-primary col-4">Allocation of employees</button>
                    <button className="btn btn-success col-2">
                    </button>
                    <div className="col-1"></div>
                </div>
                <br></br>
                <Table firstRow={firstRow} content={content} onCellEdit={handleCellEdit} onRowDelete={deleteRow} onRowAdd={addRow}></Table>
                <div className="row"><br /></div>
                <div className="d-flex justify-content-between mb-3 down-buttons">
                    <div className="col-3"></div>
                    <button className="btn btn-success col-3" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary col-3" onClick={addRowHandler} >Add Row</button>
                    <div className="col-3"></div>
                </div>
            </div>
        </div>)
}

export default EditFile;