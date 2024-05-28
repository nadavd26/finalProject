import TableAlgo2 from "./TableAlgo2/Table";
import Upload from './images/uploadImage.webp'
import './css/bootstrap.min.css'
import './css/table-main.css'
import './css/perfect-scrollbar.css'
import Dropdown from "./conponenets/Dropdown";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import Loader from "./conponenets/Loader";
import { useTableScreenState } from "./states/TableScreenState";
import { useTableAlgo2State } from "./states/TableAlgo2State";
import { useEditInfoState } from "./states/EditInfo";
import { useTableAlgo1State } from "./states/TableAlgo1State";
import EditResFile1 from "./Edit/EditTable1/EditResFile1";
import { Modal, Button } from 'react-bootstrap';
import { ExclamationTriangleFill, FileX } from 'react-bootstrap-icons';
import * as algo1api from '../api/Algo1Api'
import * as algo2api from '../api/Algo2Api'

import SkillDropdown from "./conponenets/SkillDropdown";
import * as utils from './Utils'
import EditResFile2 from "./Edit/EditTable2/EditResFile2";
import GraphMemo from "./conponenets/Graph";
// expecting json: {"Sunday" : [{"worker":"name1", "shifts":[true, true, false, ...]}, {"worker":"name2", "shifts":[true, true, false, ...]}, ....], ... , "Saturday" : ...}
// every boolean array is 48 cells, starting from 7:00, ending at 23:30

function TableScreen({ user, setUser }) {
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [reqs, setReqs] = useState(undefined)
    const [shifts, setShifts] = useState(undefined)
    const handleCloseGenerateModal = () => {
        setShowGenerateModal(false);
    };
    const [table1Algo1Changed, setTable1Algo1Changed] = useState(false)
    const [validationWarning, setValidationWarning] = useState("")
    const [showWarningModal, setShowWarningModal] = useState(false)

    const navigate = useNavigate();
    const tableScreenState = useTableScreenState();
    const algo2TableState = useTableAlgo2State();
    const tableAlgo1State = useTableAlgo1State()
    const editInfoState = useEditInfoState()
    console.log(reqs)
    console.log("user")
    console.log(user)
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
            setShifts(((user.algo1Table).get(key)))
            console.log("key1")
            console.log(key1)
            var newReq = ((user.daySkillReqMap).get(key1))
            console.log("newReq")
            console.log(newReq)
            setReqs(newReq)
        }
    }

    function handlerSkillChange(skill) {
        var skillList = user.skillList
        var newSkillList = utils.removeElementFromArray(skillList, skill)
        tableAlgo1State.setOtherSkills(newSkillList)
        tableAlgo1State.setCurrentSkill(skill)
        const key = utils.getKey(tableScreenState.get.currentDay, skill)
        const key1 = utils.getKey(tableScreenState.get.currentDay, skill, true)
        console.log("key1")
        console.log(key1)
        // console.log("key " + key)
        setShifts(((user.algo1Table).get(key)))
        var newReq = ((user.daySkillReqMap).get(key1))
        console.log("newReq")
        console.log(newReq)
        setReqs(newReq)
        // console.log("res " + ((user.algo1Table).get(key)))
    }

    function handleEdit() {
        if ((tableScreenState.get.tableNum == 1 && !tableScreenState.get.is1Generated) || (tableScreenState.get.tableNum == 2 && !tableScreenState.get.is2Generated) || (tableScreenState.get.tableNum == 1 && (!reqs || reqs.length == 0 || !shifts || shifts.length == 0))) {
            return
        }
        editInfoState.setInEdit(true)
    }


    function generateResults1() {
        console.log("gen res 1")
        var newUser = user
        var newReq = []
        const algo1Callback = (res) => {
            newUser.algo1Table = res
            var newWorkersPerShift = res.get(key)
            setShifts(newWorkersPerShift)
            setReqs(newReq)
            tableScreenState.setIs1Generated(true)
            console.log("finish callback")
        }
        algo1api.generateAlgo1Results(user.token, user.tableAlgo1FromDb, algo1Callback)

        // console.log("res")
        // console.log(res)
        const newDaySkillReqMap = utils.generateReqSkillDayMap(user.table2)
        console.log("newDaySkillReqMap")
        console.log(newDaySkillReqMap)
        // newUser.algo1Table = res
        newUser.daySkillReqMap = newDaySkillReqMap
        newUser.skillList = utils.getSkillSet(user.table2)
        const startSkill = (newUser.skillList)[0]
        tableAlgo1State.setCurrentSkill(startSkill)
        tableAlgo1State.setOtherSkills((utils.removeElementAtIndex(newUser.skillList, 0)))
        const key = utils.getKey("sunday", startSkill)
        const key1 = utils.getKey("sunday", startSkill, true)
        tableAlgo1State.setKey(key)
        // var newWorkersPerShift = res.get(key)
        newReq = newDaySkillReqMap.get(key1)
        console.log("newDaySkillReqMap")
        console.log(newDaySkillReqMap)
        console.log("newReq")
        console.log(newReq)

        var workerMap = utils.generateWorkerMap(user.table1)
        // console.log("worker map : " +workerMap)
        tableScreenState.setWorkerMap(workerMap)
        // tableAlgo1State.setWorksPerShift(newWorkersPerShift)
        setUser(newUser)
        console.log("finish code")
        // tableScreenState.setIs1Generated(true)
    }
    // async function generateResults1() {

    //     const res = await utils.generateAlgo1Results(user.token, user.tableAlgo1FromDb)
    //     console.log("res")
    //     console.log(res)
    //     const newDaySkillReqMap = utils.generateReqSkillDayMap(user.table2)
    //     console.log("newDaySkillReqMap")
    //     console.log(newDaySkillReqMap)
    //     var newUser = user
    //     newUser.algo1Table = res
    //     newUser.daySkillReqMap = newDaySkillReqMap
    //     newUser.skillList = utils.getSkillSet(user.table2)
    //     const startSkill = (newUser.skillList)[0]
    //     tableAlgo1State.setCurrentSkill(startSkill)
    //     tableAlgo1State.setOtherSkills((utils.removeElementAtIndex(newUser.skillList, 0)))
    //     const key = utils.getKey("sunday", startSkill)
    //     const key1 = utils.getKey("sunday", startSkill, true)
    //     tableAlgo1State.setKey(key)
    //     var newWorkersPerShift = res.get(key)
    //     var newReq = newDaySkillReqMap.get(key1)
    //     console.log("newDaySkillReqMap")
    //     console.log(newDaySkillReqMap)
    //     console.log("newReq")
    //     console.log(newReq)
    //     tableAlgo1State.setReq(newReq)
    //     tableAlgo1State.setWorksPerShift(newWorkersPerShift)
    //     setUser(newUser)
    //     tableScreenState.setIs1Generated(true)
    // }
    async function generateResults2(algo2table, fromDb) {
        var newUser = user
        if (!algo2table) {
            newUser.contracts = []
        }
        const res = algo2table ? algo2table : await algo2api.generateAlgo2Results(user.token, fromDb)
        // console.log("res")
        // console.log(JSON.stringify(res))
        if (!algo2table) {
            newUser.contracts = utils.generateContracts(user.table1, res)
            console.log("newUser.contracts")
            console.log(newUser.contracts)
        }
        newUser.algo2Table = res
        const ui = utils.generateAlgoGraphicResults(res)
        newUser.algo2Graphic = ui
        var shifts = utils.generateAlgoShifts(res)
        // console.log("shifts")
        // console.log(shifts)

        // console.log("ui")
        // console.log(JSON.stringify(ui))
        setUser(newUser)
        algo2TableState.setShiftsInfo(shifts)
        var shiftsPerWorkers = utils.generateShiftsPerWorker(res)
        algo2TableState.setShiftsPerWorkers(shiftsPerWorkers)
        algo2TableState.setCurrentWorkersAndShifts((user.algo2Graphic)[tableScreenState.get.currentDay])
        console.log("newUser")
        console.log(newUser)
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
            const validate = await algo1api.validateAlgo1Table1(user.token)
            setTable1Algo1Changed(validate.changed)
            console.log("validate")
            console.log(validate)
            if (validate.type == "success") {
                await generateAnyway(validate.changed)
            } else {
                setShowWarningModal(true)
                setValidationWarning(validate.msg)
            }
            return
        }

        if (num == 1 && !tableScreenState.get.is2Generated) {
            return
        }

        tableScreenState.setTableNum(num)
    }

    const generateAgain = async () => {
        tableScreenState.setTableNum(2)
        setShowGenerateModal(false)
        await generateResults2(false, false);
    }

    const proceedCurrent = async () => {
        tableScreenState.setTableNum(2)
        setShowGenerateModal(false)
        await generateResults2(false, true);
    }

    const generateAnyway = async (changed) => {
        setShowWarningModal(false)
        if (changed) {
            tableScreenState.setTableNum(2)
            await generateResults2(false, false);
        } else {
            setShowGenerateModal(true)
        }
    }

    useEffect(() => {
        console.log("geneneen")
        generateResults1();
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
        await generateResults2(user.algo2Table, true)
    }

    //i want to pass a deep copy to EditResFile2 and because json.parse does not parse sets, i need to convert them to array, parse and then convert back to sets 
    const editComponent = tableScreenState.get.tableNum === 1 ? (
        <EditResFile1
            initialTable={shifts}
            currentDay={tableScreenState.get.currentDay}
            currentSkill={tableAlgo1State.get.currentSkill}
            setWorksPerShift={setShifts}
            setInEdit={editInfoState.setInEdit}
            user={user}
            setUser={setUser}
            finishCallback={table1finishEditCallback}
        />
    ) : (
        <EditResFile2 initialTable={JSON.parse(JSON.stringify(user.algo2Table))} contracts={JSON.parse(JSON.stringify(user.contracts))}
            currentDay={tableScreenState.get.currentDay} setInEdit={editInfoState.setInEdit} user={user} setUser={setUser} workerMap={tableScreenState.get.workerMap}
            shiftsInfo={(algo2TableState.get.shiftInfo)} shiftsPerWorkers={arraysToSets(JSON.parse(JSON.stringify(setsToArrays(algo2TableState.get.shiftsPerWorkers))))} setShiftsPerWorkers={algo2TableState.setShiftsPerWorkers} finishCallback={table2finishEditCallback} />
    );

    const backToUpload = () => {
        navigate("/upload")
    }
    return (
        !editInfoState.get.inEdit ? (
            <div id="table-screen" style={{ maxHeight: "100vh" }}>
                <div className="container-fluid py-3" >
                    <div className="d-flex justify-content-between mb-3 top-buttons" style={{ position: "fixed", top: "1%", height: "7%", width: "100%" }}>
                        <div className="col-1"></div>
                        <button className={`btn ${tableScreenState.get.tableNum === 2 ? 'btn-secondary' : 'btn-primary'} col-4`} onClick={() => changeTable(1)}>Amount of employees required for each shift</button>
                        <button className={`btn ${tableScreenState.get.tableNum === 1 ? 'btn-secondary' : 'btn-primary'} col-4`} onClick={() => changeTable(2)}>Allocation of employees</button>
                        <button className="btn btn-success col-2" onClick={backToUpload}>
                            <img src={Upload} alt="Upload" className="upload-image" />
                        </button>
                        <div className="col-1"></div>
                    </div>
                    {tableScreenState.get.tableNum === 2 ? (
                        <div>
                            <div className="row" style={{ position: "relative", top: "6vh" }}>
                                <div className="col-3"></div>
                                <div className="col-6 text-center">
                                    <Dropdown firstDay={tableScreenState.get.currentDay} dayHandler={switchDay}></Dropdown>
                                </div>
                                <div className="col-3"></div>
                            </div>
                            {tableScreenState.get.is2Generated ? (
                                <TableAlgo2 workersAndShifts={algo2TableState.get.currentWorkersAndShifts} />
                            ) : (
                                <>
                                    {/* <TableAlgo2 workersAndShifts={algo2TableState.get.currentWorkersAndShifts} /> */}
                                    <Loader speed={5} customText="Calculating..." />
                                </>
                            )}
                        </div>
                    ) : ( //current table table 1
                        <>
                            {!tableScreenState.get.is1Generated ? (
                                <><div className="row" style={{ position: "relative", top: "6vh" }}>
                                    <div className="col-3"></div>
                                    <div className="col-6 text-center">
                                        <Dropdown firstDay={tableScreenState.get.currentDay} dayHandler={switchDay}></Dropdown>
                                    </div>
                                    <div className="col-3"></div>
                                </div>
                                    <br></br><br></br><Loader speed={5} customText="Calculating..." /></>
                            ) : (<div>
                                <div className="row" style={{ position: "relative", top: "6vh" }}>
                                    <div className="col-3"></div>
                                    <div className="col-6 d-flex justify-content-between align-items-center">
                                        <div style={{ marginRight: "10px" }}><Dropdown firstDay={tableScreenState.get.currentDay} dayHandler={switchDay} /></div>
                                        <div><SkillDropdown currentSkill={tableAlgo1State.get.currentSkill} skillList={tableAlgo1State.get.otherSkills} handlerSkill={handlerSkillChange} /></div>
                                    </div>
                                    <div className="col-3"></div>
                                </div>


                                <br></br>
                                <div className="row" >
                                    <div className="col-1"></div>
                                    <div className="col-10">
                                        <GraphMemo reqs={!(reqs) ? [] : reqs} shifts={!(shifts) ? [] : shifts} skill={tableAlgo1State.get.currentSkill} day={tableScreenState.get.currentDay} user={user} setUser={setUser}></GraphMemo>
                                    </div>
                                    <div className="col-1">
                                        {/* <div>reqs {JSON.stringify(!(tableAlgo1State.get.req) ? [] : tableAlgo1State.get.req)}</div>
                                        <div>shifts {JSON.stringify(!(tableAlgo1State.get.worksPerShift) ? [] : tableAlgo1State.get.worksPerShift)}</div> */}
                                    </div>
                                </div>
                                <br></br>
                            </div>)}
                        </>
                    )}
                    <div className="d-flex justify-content-between fixed-bottom mb-3" style={{ marginBottom: "1000px" }}>
                        <div className="col-4"></div>
                        <button className="btn btn-secondary col-4" onClick={() => handleEdit()}>Edit</button>
                        <div className="col-4"></div>
                    </div>

                </div>
                <Modal show={showGenerateModal} onHide={handleCloseGenerateModal} centered>
                    <Modal.Header style={{ paddingRight: '1rem' }}>
                        <Modal.Title className="text-center w-100">Which Results To Choose?</Modal.Title>
                        <button type="button" className="close" onClick={() => setShowGenerateModal(false)} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={generateAgain} className="mr-auto">
                            Generate results again
                        </Button>
                        <Button variant="success" onClick={proceedCurrent}>
                            Proceed with current results
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showWarningModal} onHide={() => setShowWarningModal(false)} centered>
                    <Modal.Header style={{ backgroundColor: '#FCFFA5', paddingRight: '1rem' }}>
                        <Modal.Title className="text-center w-100" style={{ color: '#7F8307' }}>
                            <ExclamationTriangleFill style={{ marginRight: '10px', color: '#7F8307' }} /> Warning
                        </Modal.Title>
                        <button type="button" className="close" onClick={() => setShowWarningModal(false)} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#FCFFA5', color: '#7F8307', whiteSpace: 'pre-wrap' }}>
                        {validationWarning}
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: '#FCFFA5', display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={() => setShowWarningModal(false)} className="mr-auto" style={{ backgroundColor: '#7F8307', borderColor: '#7F8307' }}>
                            Ok
                        </Button>
                        <Button variant="danger" onClick={() => generateAnyway(table1Algo1Changed)} style={{ backgroundColor: '#7F8307', borderColor: '#7F8307' }}>
                            Generate Anyway
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        ) : <>{editComponent}</>
    );
}

export default TableScreen;

