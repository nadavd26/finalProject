import Table from "./conponenets/Table";
import Upload from './images/uploadImage.webp'
import './css/bootstrap.min.css'
import './css/table-main.css'
import './css/perfect-scrollbar.css'
import Dropdown from "./conponenets/Dropdown";
import { useState } from "react";
// expecting json: {"Sunday" : [{"worker":"name1", "shifts":[true, true, false, ...]}, {"worker":"name2", "shifts":[true, true, false, ...]}, ....], ... , "Saturday" : ...}
// every boolean array is 48 cells, starting from 7:00, ending at 23:30

function TableScreen({ daysWorkersAndShifts }) {
    const [currentDay, setCurrentDay] = useState("Sunday");
    const [currentWorkersAndShifts, setCurrentWorkersAndShifts] = useState(daysWorkersAndShifts["Sunday"])
    function foo(day) {
        setCurrentDay(day)
        setCurrentWorkersAndShifts(daysWorkersAndShifts[day])
    }
    return (
        <div id="table-screen">
            <div className="container-fluid py-3">
                <div className="d-flex justify-content-between mb-3 top-buttons">
                    <div className="col-1"></div>
                    <button className="btn btn-secondary col-4">Amount of employees required for each shift</button>
                    <button className="btn btn-primary col-4">Allocation of employees</button>
                    <button className="btn btn-success col-2">
                        <img src={Upload} alt="Upload" className="upload-image" />
                    </button>
                    <div className="col-1"></div>
                </div>
                <div className="row">
                    <div className="col-5"></div>
                    <Dropdown firstDay={currentDay} dayHandler={foo}></Dropdown>
                    <div className="col-5"></div>
                </div>
                <br></br>
                <Table workersAndShifts={currentWorkersAndShifts}></Table>
                <div className="row"><br /></div>
                <div className="d-flex justify-content-between mb-3 down-buttons">
                    <div className="col-4"></div>
                    <button className="btn btn-secondary col-4">Edit</button>
                    <div className="col-4"></div>
                </div>
            </div>
        </div>)
}

export default TableScreen;