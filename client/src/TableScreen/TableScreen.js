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
import { useEditInfoState } from "./states/EditInfo";
import { useTableAlgo1State } from "./states/TableAlgo1State";
import EditResFile1 from "./Edit/EditTable1/EditResFile1";
import SkillDropdown from "./conponenets/SkillDropdown";
import * as utils from './Utils'
// expecting json: {"Sunday" : [{"worker":"name1", "shifts":[true, true, false, ...]}, {"worker":"name2", "shifts":[true, true, false, ...]}, ....], ... , "Saturday" : ...}
// every boolean array is 48 cells, starting from 7:00, ending at 23:30

function TableScreen({ user, setUser }) {
    const tableScreenState = useTableScreenState();
    const algo2TableState = useTableAlgo2State();
    const tableAlgo1State = useTableAlgo1State()
    const editInfoState = useEditInfoState()

    function switchDay(day) {
        if ((tableScreenState.get.tableNum == 1 && !tableScreenState.get.is1Generated) || (tableScreenState.get.tableNum == 2 && !tableScreenState.get.is2Generated)) {
            return
        }
        tableScreenState.setCurrentDay(day)
        if (tableScreenState.get.is2Generated) {
            algo2TableState.setCurrentWorkersAndShifts((user.algo2Table)[day])
        }
    }

    function handlerSkillChange(skill) {
        var skillList = user.skillList
        var newSkillList = utils.removeElementFromArray(skillList, skill)
        tableAlgo1State.setOtherSkills(newSkillList)
        tableAlgo1State.setCurrentSkill(skill)
        const key =  utils.getKey(tableScreenState.get.currentDay, tableAlgo1State.get.currentSkill)
        console.log("key " + key)
        tableAlgo1State.setWorksPerShift(((user.algo1Table).get(key)))   
        console.log("res " + ((user.algo1Table).get(key)))
    }

    function handleEdit() {
        if ((tableScreenState.get.tableNum == 1 && !tableScreenState.get.is1Generated) || (tableScreenState.get.tableNum == 2 && !tableScreenState.get.is2Generated)) {
            return
        }
        editInfoState.setInEdit(true)
    }
    async function generateResults1() {
        const res = await utils.generateAlgo1Results()
        var newUser = user
        newUser.algo1Table = res
        setUser(newUser)
        tableScreenState.setIs1Generated(true)
    }

    async function generateResults2() {
        const daysWorkersAndShifts = await utils.generateAlgo2Results()
        var newUser = user
        newUser.algo2Table = daysWorkersAndShifts
        setUser(newUser)
        algo2TableState.setCurrentWorkersAndShifts((user.algo2Table)[tableScreenState.get.currentDay])
        tableScreenState.setIs2Generated(true)
    }

    async function changeTable(num) {
        if (tableScreenState.get.tableNum == num) {
            return
        }
        if (!tableScreenState.get.is1Generated) {
            return
        }

        if (num == 2 && !tableScreenState.get.is2Generated) {
            tableScreenState.setTableNum(num)
            await generateResults2();
            return
        }

        if (num == 1 && !tableScreenState.get.is2Generated) {
            return
        }

        tableScreenState.setTableNum(num)
    }

    useEffect(() => {
        generateResults1();
        var newUser = user
        newUser.skillList = utils.getSkillSet(user.table2)
        setUser(newUser)
        tableAlgo1State.setCurrentSkill((newUser.skillList)[0])
        tableAlgo1State.setOtherSkills((utils.removeElementAtIndex(newUser.skillList, 0)))
        tableAlgo1State.setKey(utils.getKey(tableScreenState.get.currentDay, algo2TableState.get))
    }, []);
    return (
        !editInfoState.get.inEdit ? (
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
                                <div className="col-3"></div>
                                <div className="col-6 text-center">
                                    <Dropdown firstDay={tableScreenState.get.currentDay} dayHandler={switchDay}></Dropdown>
                                </div>
                                <div className="col-3"></div>
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
                    ) : (
                        <>
                            {!tableScreenState.get.is1Generated ? (
                                <><div className="row">
                                    <div className="col-3"></div>
                                    <div className="col-6 text-center">
                                        <Dropdown firstDay={tableScreenState.get.currentDay} dayHandler={switchDay}></Dropdown>
                                    </div>
                                    <div className="col-3"></div>
                                </div>
                                    <br></br><br></br><Loader speed={5} customText="Calculating..." /></>
                            ) : (<div>
                                <div className="row">
                                    <div className="col-5"></div>
                                    <div className="col-1 text-center">
                                        <Dropdown firstDay={tableScreenState.get.currentDay} dayHandler={switchDay}></Dropdown>
                                    </div>
                                    <div className="col-1 text-center">
                                        <SkillDropdown currentSkill={tableAlgo1State.get.currentSkill} skillList={tableAlgo1State.get.otherSkills} handlerSkill={handlerSkillChange} />
                                    </div>
                                    <div className="col-5"></div>
                                </div>
                                <br></br>
                                <br></br>
                            </div>)}
                        </>
                    )}

                    <div className="row"><br /></div>
                    <div className="row"><br /></div>
                    <div className="d-flex justify-content-between mb-3 down-buttons">
                        <div className="col-4"></div>
                        <button className="btn btn-secondary col-4" onClick={() => handleEdit()}>Edit</button>
                        <div className="col-4"></div>
                    </div>
                </div>
            </div>
        ) : <EditResFile1 initialTable={(tableAlgo1State.get.worksPerShift)} setInEdit={editInfoState.setInEdit} user={user} setUser={setUser}/>
    );
}

export default TableScreen;

