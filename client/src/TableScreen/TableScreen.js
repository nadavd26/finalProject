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
import EditResFile2 from "./Edit/EditTable2/EditResFile2";
// expecting json: {"Sunday" : [{"worker":"name1", "shifts":[true, true, false, ...]}, {"worker":"name2", "shifts":[true, true, false, ...]}, ....], ... , "Saturday" : ...}
// every boolean array is 48 cells, starting from 7:00, ending at 23:30

function TableScreen({ user, setUser }) {
    const tableScreenState = useTableScreenState();
    const algo2TableState = useTableAlgo2State();
    const tableAlgo1State = useTableAlgo1State()
    const editInfoState = useEditInfoState()
    console.log(tableAlgo1State.get.req)
    function switchDay(day) {
        if ((tableScreenState.get.tableNum == 1 && !tableScreenState.get.is1Generated) || (tableScreenState.get.tableNum == 2 && !tableScreenState.get.is2Generated)) {
            return
        }
        tableScreenState.setCurrentDay(day)
        if (tableScreenState.get.is2Generated) {
            algo2TableState.setCurrentWorkersAndShifts((user.algo2Graphic)[day])
        }

        if (tableScreenState.get.is1Generated) {
            const key = utils.getKey(day, tableAlgo1State.get.currentSkill)
            const key1 = utils.getKey(day, tableAlgo1State.get.currentSkill, true)
            tableAlgo1State.setWorksPerShift(((user.algo1Table).get(key)))
            tableAlgo1State.setReq(((user.daySkillReqMap).get(key1)))
        }
    }

    function handlerSkillChange(skill) {
        var skillList = user.skillList
        var newSkillList = utils.removeElementFromArray(skillList, skill)
        tableAlgo1State.setOtherSkills(newSkillList)
        tableAlgo1State.setCurrentSkill(skill)
        const key = utils.getKey(tableScreenState.get.currentDay, skill)
        const key1 = utils.getKey(tableScreenState.get.currentDay, skill, true)
        // console.log("key " + key)
        tableAlgo1State.setWorksPerShift(((user.algo1Table).get(key)))
        tableAlgo1State.setReq(((user.daySkillReqMap).get(key1)))
        // console.log("res " + ((user.algo1Table).get(key)))
    }

    function handleEdit() {
        if ((tableScreenState.get.tableNum == 1 && !tableScreenState.get.is1Generated) || (tableScreenState.get.tableNum == 2 && !tableScreenState.get.is2Generated) || (tableScreenState.get.tableNum == 1 && !tableAlgo1State.get.worksPerShift)) {
            return
        }
        editInfoState.setInEdit(true)
    }
    async function generateResults1() {
        const res = await utils.generateAlgo1Results(user.table3)
        console.log("res")
        console.log(res)
        const newDaySkillReqMap = utils.generateReqSkillDayMap(user.table2)
        var newUser = user
        newUser.algo1Table = res
        newUser.daySkillReqMap = newDaySkillReqMap
        newUser.skillList = utils.getSkillSet(user.table2)
        const startSkill = (newUser.skillList)[0]
        tableAlgo1State.setCurrentSkill(startSkill)
        tableAlgo1State.setOtherSkills((utils.removeElementAtIndex(newUser.skillList, 0)))
        const key = utils.getKey("sunday", startSkill)
        const key1 = utils.getKey("sunday", startSkill, true)
        tableAlgo1State.setKey(key)
        var newWorkersPerShift = res.get(key)
        var newReq = newDaySkillReqMap.get(key1)
        console.log("newDaySkillReqMap")
        console.log(newDaySkillReqMap)
        console.log("newReq")
        console.log(newReq)
        tableAlgo1State.setReq(newReq)
        tableAlgo1State.setWorksPerShift(newWorkersPerShift)
        setUser(newUser)
        tableScreenState.setIs1Generated(true)
    }

    async function generateResults2(algo2table) {
        const res = algo2table ? algo2table : await utils.generateAlgo2Results(user.table3)
        console.log("res")
        console.log(JSON.stringify(res))
        var newUser = user
        newUser.algo2Table = res
        const ui = utils.generateAlgoGraphicResults(res, user.table1)
        newUser.algo2Graphic = ui
        var shifts = utils.generateAlgoShifts(res)
        // console.log("shifts")
        // console.log(shifts)
        algo2TableState.setShiftsInfo(shifts)
        var shiftsPerWorkers = utils.generateShiftsPerWorker(res)
        algo2TableState.setShiftsPerWorkers(shiftsPerWorkers)
        console.log("ui")
        console.log(JSON.stringify(ui))
        setUser(newUser)
        algo2TableState.setCurrentWorkersAndShifts((user.algo2Graphic)[tableScreenState.get.currentDay])
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
        var workerMap = utils.generateWorkerMap(user.table1)
        // console.log("worker map : " +workerMap)
        tableScreenState.setWorkerMap(workerMap)
    }, []);

    function setsToArrays(obj) {
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = {};
                for (const innerKey in obj[key]) {
                    if (obj[key].hasOwnProperty(innerKey)) {
                        newObj[key][innerKey] = Array.from(obj[key][innerKey] instanceof Set ? obj[key][innerKey] : []);
                    }
                }
            }
        }
        return newObj;
    }

    function arraysToSets(obj) {
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = {};
                for (const innerKey in obj[key]) {
                    if (obj[key].hasOwnProperty(innerKey)) {
                        newObj[key][innerKey] = new Set(obj[key][innerKey]);
                    }
                }
            }
        }
        return newObj;
    }

    function table1finishEditCallback() {
        tableScreenState.setIs2Generated(false)
    }

    async function table2finishEditCallback() {
        await generateResults2(user.algo2Table)
    }

    //i want to pass a deep copy to EditResFile2 and because json.parse does not parse sets, i need to convert them to array, parse and then convert back to sets 
    const editComponent = tableScreenState.get.tableNum === 1 ? (
        <EditResFile1
            initialTable={tableAlgo1State.get.worksPerShift}
            currentDay={tableScreenState.get.currentDay}
            currentSkill={tableAlgo1State.get.currentSkill}
            setWorksPerShift={tableAlgo1State.setWorksPerShift}
            setInEdit={editInfoState.setInEdit}
            user={user}
            setUser={setUser}
            finishCallback={table1finishEditCallback}
        />
    ) : (
        <EditResFile2 initialTable={JSON.parse(JSON.stringify(user.algo2Table))}
            currentDay={tableScreenState.get.currentDay} setInEdit={editInfoState.setInEdit} user={user} setUser={setUser} workerMap={tableScreenState.get.workerMap}
            shiftsInfo={(algo2TableState.get.shiftInfo)} shiftsPerWorkers={arraysToSets(JSON.parse(JSON.stringify(setsToArrays(algo2TableState.get.shiftsPerWorkers))))} setShiftsPerWorkers={algo2TableState.setShiftsPerWorkers} finishCallback={table2finishEditCallback}/>
    );

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
                    ) : ( //current table table 1
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
                                    <div className="col-5">{"" + tableAlgo1State.get.req}</div>
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
        ) : <>{editComponent}</>
    );
}

export default TableScreen;

