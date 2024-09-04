import { useEffect, useState } from "react";
import { Button, Modal } from 'react-bootstrap';
import { AppIndicator, ExclamationTriangleFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import * as algo1api from '../api/Algo1Api';
import * as algo2api from '../api/Algo2Api';
import Loader from "../components/Loader";
import EditResFile1 from "./Edit/EditTable1/EditResFile1";
import EditResFile2 from "./Edit/EditTable2/EditResFile2";
import TableAlgo2 from "./TableAlgo2/Table";
import * as utils from './Utils';
import Dropdown from "./components/Dropdown";
import GraphMemo from "./components/Graph";
import SkillDropdown from "./components/SkillDropdown";
import './css/bootstrap.min.css';
import './css/perfect-scrollbar.css';
import './css/table-main.css';
import edit from './images/edit.webp';
import Upload from './images/uploadImage.webp';
import { useEditInfoState } from "./states/EditInfo";
import { useTableAlgo1State } from "./states/TableAlgo1State";
import { useTableAlgo2State } from "./states/TableAlgo2State";
import { useTableScreenState } from "./states/TableScreenState";
import infoImg from './images/info.png'
// expecting json: {"Sunday" : [{"worker":"name1", "shifts":[true, true, false, ...]}, {"worker":"name2", "shifts":[true, true, false, ...]}, ....], ... , "Saturday" : ...}
// every boolean array is 48 cells, starting from 7:00, ending at 23:30

function TableScreen({ user, setUser }) {
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [reqs, setReqs] = useState(undefined)
    const [shifts, setShifts] = useState(undefined)
    const handleCloseGenerateModal = () => {
        setShowGenerateModal(false);
    };
    const [showInfo2Modal, setShowInfo2Modal] = useState(false)
    const [infoTable2, setInfoTable2] = useState("")

    const [table1Algo1Changed, setTable1Algo1Changed] = useState(false)
    const [validationWarning, setValidationWarning] = useState("")
    const [showWarningModal, setShowWarningModal] = useState(false)

    const navigate = useNavigate();
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
            algo2TableState.setCurrentWorkersAndShifts((user.algo2Graphic)[day])
        }

        if (tableScreenState.get.is1Generated) {
            const key = utils.getKey(day, tableAlgo1State.get.currentSkill)
            const key1 = utils.getKey(day, tableAlgo1State.get.currentSkill, true)
            setShifts(((user.algo1Table).get(key)))
            var newReq = ((user.daySkillReqMap).get(key1))
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
        setShifts(((user.algo1Table).get(key)))
        var newReq = ((user.daySkillReqMap).get(key1))
        setReqs(newReq)
    }

    function handleEdit() {
        if ((tableScreenState.get.tableNum == 1 && !tableScreenState.get.is1Generated) || (tableScreenState.get.tableNum == 2 && !tableScreenState.get.is2Generated) || (tableScreenState.get.tableNum == 1 && (!reqs || reqs.length == 0 || !shifts || shifts.length == 0))) {
            return
        }
        editInfoState.setInEdit(true)
    }


    function generateResults1() {

        var newUser = user
        var newReq = []
        const algo1Callback = (res) => {
            newUser.algo1Table = res
            var newWorkersPerShift = res.get(key)
            setShifts(newWorkersPerShift)
            setReqs(newReq)
            tableScreenState.setIs1Generated(true)

        }
        algo1api.generateAlgo1Results(user.token, user.tableAlgo1FromDb, algo1Callback)
        const newDaySkillReqMap = utils.generateReqSkillDayMap(user.table2)
        newUser.daySkillReqMap = newDaySkillReqMap
        newUser.skillList = utils.getSkillSet(user.table2)
        const startSkill = (newUser.skillList)[0]
        tableAlgo1State.setCurrentSkill(startSkill)
        tableAlgo1State.setOtherSkills((utils.removeElementAtIndex(newUser.skillList, 0)))
        const key = utils.getKey("sunday", startSkill)
        const key1 = utils.getKey("sunday", startSkill, true)
        tableAlgo1State.setKey(key)
        newReq = newDaySkillReqMap.get(key1)
        var workerMap = utils.generateWorkerMap(user.table1)
        tableScreenState.setWorkerMap(workerMap)
        setUser(newUser)

    }

    async function generateResults2(algo2table, fromDb, autoComplete, empty) {
        var newUser = user
        if (!algo2table) {
            newUser.contracts = []
        }
        const res = algo2table ? algo2table : await algo2api.generateAlgo2Results(user.token, fromDb, autoComplete, empty)
        if (!algo2table) {
            newUser.contracts = utils.generateContracts(user.table1, res)


        }
        newUser.algo2Table = res
        const ui = utils.generateAlgoGraphicResults(res)
        newUser.algo2Graphic = ui
        var shifts = utils.generateAlgoShifts(res)
        setUser(newUser)
        algo2TableState.setShiftsInfo(shifts)
        var shiftsPerWorkers = utils.generateShiftsPerWorker(res)
        algo2TableState.setShiftsPerWorkers(shiftsPerWorkers)
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
            const validate = await algo1api.validateAlgo1Table1(user.token)
            setTable1Algo1Changed(validate.changed)


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
        await generateResults2(false, false, false, false);
    }

    const proceedCurrent = async () => {
        tableScreenState.setTableNum(2)
        setShowGenerateModal(false)
        await generateResults2(false, true, false, false);
    }

    const generateAnyway = async (changed) => {
        setShowWarningModal(false)
        if (changed) {
            tableScreenState.setTableNum(2)
            await generateResults2(false, false, false, false);
        } else {
            setShowGenerateModal(true)
        }
    }

    useEffect(() => {

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

    const autoComplete = async () => {
        tableScreenState.setIs2Generated(false)
        await generateResults2(false, false, true, false)
    }

    const clear = async () => {
        tableScreenState.setIs2Generated(false)
        await generateResults2(false, false, false, true)
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
        await generateResults2(user.algo2Table, true, false, false)
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

    const showInfoTable2 = () => {
        const info2 = algo2api.getTableInfomarion(user.token)
        setInfoTable2(info2)
        setShowInfo2Modal(true)
    }

    const buttonsHeight = "2.7rem"
    return (
        !editInfoState.get.inEdit ? (
            <div id="table-screen" style={{ maxHeight: "100vh" }}>
                <div className="container-fluid py-3" >
                    <div className="d-flex justify-content-center mb-3" style={{ position: "fixed", top: "1%", left: "2%", height: "7%", width: "96%" }}>
                        <button
                            className={`btn ${tableScreenState.get.tableNum === 2 ? 'btn-secondary' : 'btn-primary'} col-4`}
                            onClick={() => changeTable(1)}
                            style={{ margin: "0 5px", height: buttonsHeight }} // Adjust the margin value as needed
                        >
                            Amount of employees required for each shift
                        </button>
                        <button
                            className={`btn ${tableScreenState.get.tableNum === 1 ? 'btn-secondary' : 'btn-primary'} col-4`}
                            onClick={() => changeTable(2)}
                            style={{ margin: "0 5px", height: buttonsHeight }} // Adjust the margin value as needed
                        >
                            Allocation of employees
                        </button>



                        <Button
                            variant="success"
                            style={{
                                display: tableScreenState.get.tableNum === 2 && tableScreenState.get.is2Generated ? "block" : "none",
                                width: buttonsHeight, // Set width using relative units
                                height: buttonsHeight, // Keep height equal to width
                                padding: 0, // Ensure no padding inside the button
                                margin: "0 0.3rem", // Adjust the margin using relative units
                            }}
                            onClick={backToUpload}
                        >
                            <img
                                src={Upload} // Replace with your image source
                                alt="Info"
                                style={{
                                    width: "80%", // Make the image fill the button
                                    height: "80%", // Keep the image square
                                    objectFit: "contain", // Ensure the image fits within the button
                                }}
                            />
                        </Button>

                        <Button
                            variant="primary"
                            style={{
                                display: tableScreenState.get.tableNum === 2 && tableScreenState.get.is2Generated ? "block" : "none",
                                margin: "0 5px",  // Adjust the margin value as needed
                                height: buttonsHeight
                            }}
                            onClick={autoComplete}
                        >
                            Auto Complete
                        </Button>
                        <Button
                            variant="danger"
                            style={{
                                display: tableScreenState.get.tableNum === 2 && tableScreenState.get.is2Generated ? "block" : "none",
                                margin: "0 5px", // Adjust the margin value as needed
                                height: buttonsHeight
                            }}
                            onClick={clear}
                        >
                            Clear
                        </Button>

                        <Button
                            variant="warning"
                            style={{
                                display: tableScreenState.get.tableNum === 2 && tableScreenState.get.is2Generated ? "block" : "none",
                                width: buttonsHeight, // Set width using relative units
                                height: buttonsHeight, // Keep height equal to width
                                padding: 0, // Ensure no padding inside the button
                                margin: "0 0.3rem", // Adjust the margin using relative units
                            }}
                            onClick={showInfoTable2}
                        >
                            <img
                                src={infoImg} // Replace with your image source
                                alt="Info"
                                style={{
                                    width: "80%", // Make the image fill the button
                                    height: "80%", // Keep the image square
                                    objectFit: "contain", // Ensure the image fits within the button
                                }}
                            />
                        </Button>
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
                                    </div>
                                </div>
                                <br></br>
                            </div>)}
                        </>
                    )}


                    <div className="d-flex justify-content-center fixed-bottom mb-3" style={{ position: "fixed", top: "90.5%", width: "100%" }}>
                        <Button
                            variant="warning"
                            style={{
                                backgroundColor: "white",
                                border: "1px solid #ddd",
                                padding: 0,
                                width: "2.5vw",
                                height: "2.5vw",
                                minWidth: "45px",
                                minHeight: "45px",
                                margin: "0 0.3rem",
                            }}
                            onClick={handleEdit}
                        >
                            <img
                                src={edit}
                                alt="Edit"
                                style={{
                                    width: "100%", 
                                    height: "100%", 
                                    objectFit: "contain", 
                                }}
                            />
                        </Button>
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

                <Modal show={showInfo2Modal} onHide={() => setShowInfo2Modal(false)} centered>
                    <Modal.Header>
                        <Modal.Title>Assignment Information</Modal.Title>
                        <button type="button" className="close" onClick={() => setShowInfo2Modal(false)} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto', overflowWrap: 'break-word' }}>
                        {infoTable2}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowInfo2Modal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>


            </div>
        ) : <>{editComponent}</>
    );
}

export default TableScreen;

