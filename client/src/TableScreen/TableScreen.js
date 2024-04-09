import TableAlgo2 from "./TableAlgo2/Table";
import Upload from './images/uploadImage.webp'
import './css/bootstrap.min.css'
import './css/table-main.css'
import './css/perfect-scrollbar.css'
import Dropdown from "./conponenets/Dropdown";
import { useState, useEffect } from "react";
import Loader from "./conponenets/Loader";
import { useTableScreenState } from "./states/TableScreenState";
import { useTableAlgo2State } from "./states/TableAlgo2State";
import * as utils from './Utils'
// expecting json: {"Sunday" : [{"worker":"name1", "shifts":[true, true, false, ...]}, {"worker":"name2", "shifts":[true, true, false, ...]}, ....], ... , "Saturday" : ...}
// every boolean array is 48 cells, starting from 7:00, ending at 23:30

function TableScreen({ user, setUser }) {
    const tableScreenState = useTableScreenState();
    const algo2TableState = useTableAlgo2State();

    function foo(day) {
        if (tableScreenState.get.is2Generated) {
            algo2TableState.setCurrentDay(day)
            algo2TableState.setCurrentWorkersAndShifts((user.algo2Table)[day])
        }
    }

    async function generateResults() {
        const daysWorkersAndShifts = await utils.generateAlgo2Results()
        var newUser = user
        newUser.algo2Table = daysWorkersAndShifts
        setUser(newUser)
        algo2TableState.setCurrentWorkersAndShifts((user.algo2Table)["Sunday"])
        tableScreenState.setIs2Generated(true)
    }

    function changeTable(num) {
        tableScreenState.setTableNum(num)
    }

    useEffect(() => {
        generateResults();
    }, []);
    return (
        <div id="table-screen">
            <div className="container-fluid py-3">
                <div className="d-flex justify-content-between mb-3 top-buttons">
                    <div className="col-1"></div>
                    <button className={`btn ${tableScreenState.get.tableNum === 2 ? 'btn-secondary' : 'btn-primary'} col-4`} onClick={() => changeTable(1)}>Amount of employees required for each shift</button>
                    <button className={`btn ${tableScreenState.get.tableNum === 1 ? 'btn-secondary' : 'btn-primary'} col-4`} onClick={() => changeTable(2)}>Allocation of employees</button>
                    <button className="btn btn-success col-2">
                        <img src={Upload} alt="Upload" className="upload-image" />
                    </button>
                    <div className="col-1"></div>
                </div>
                {tableScreenState.get.tableNum === 2 ? (
                    <div>
                        <div className="row">
                            <div className="col-5"></div>
                            <Dropdown firstDay={algo2TableState.get.currentDay} dayHandler={foo}></Dropdown>
                            <div className="col-5"></div>
                        </div>
                        <br></br>
                        <br></br>
                        {tableScreenState.get.is2Generated ? (
                            <TableAlgo2 workersAndShifts={algo2TableState.get.currentWorkersAndShifts} />
                        ) : (
                            <>
                                <TableAlgo2 workersAndShifts={algo2TableState.get.currentWorkersAndShifts} />
                                <Loader speed={5} customText="Calculating..." />
                            </>
                        )}
                    </div>
                ) :
                    <>
                        <Loader speed={5} customText="Calculating..." />
                    </>
                }

                <div className="row"><br /></div>
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