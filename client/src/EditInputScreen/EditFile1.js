import { useState } from "react";
import Table from "./components/Table";
import './css/bootstrap.min.css'
import './css/edit-file-table-main.css'
import './css/perfect-scrollbar.css'
function EditFile1() {
    const firstRow = ["Day", "Skill", "From", "Until", "Required Number Of Workers"]
    const [content, setContent] = useState([["Sunday", "wifi technitian", "07:00", "10:00", 10],
    ["Sunday", "wifi technitian", "07:00", "10:00", 10]])
    const addRowHandler = () => {
        setContent([[]])
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
                <Table firstRow={firstRow} content={content}></Table>
                <div className="row"><br /></div>
                <div className="d-flex justify-content-between mb-3 down-buttons">
                    <div className="col-3"></div>
                    <button className="btn btn-success col-3">Save</button>
                    <button className="btn btn-secondary col-3" onClick={addRowHandler}>Add Row</button>
                    <div className="col-3"></div>
                </div>
            </div>
        </div>)
}

export default EditFile1;