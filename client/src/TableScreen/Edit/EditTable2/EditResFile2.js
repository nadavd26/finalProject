import { useEffect, useMemo, useState } from "react";
import Table from "./Table";
import '../css/bootstrap.min.css'
import '../css/edit-file-table-main.css'
import '../css/perfect-scrollbar.css'
import * as utils from '../../Utils'
import * as editAlgo2Utils from './Utils'
import overlapImg from '../Images/overlap.png'
import contractImg from '../Images/contract.png'
import infoImg from '../Images/info.png'
import right from '../Images/right.png'
import left from '../Images/left.png'
import search from '../Images/search.webp'
import start from '../Images/start.png'
import end from '../Images/end.png'
import Loader from "../../../components/Loader";
import SearchDropdown from "../components/SearchDropdown";
import filterTableLoader from "../components/FilterTableLoader";
import FilterTableLoader from "../components/FilterTableLoader";
import { Modal, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import * as algo2api from '../../../api/Algo2Api'
import * as model from './Model'

export default function EditResFile2({ initialTable, contracts, setInEdit, user, setUser, workerMap, shiftsInfo, shiftsPerWorkers, setShiftsPerWorkers, finishCallback }) {
    // console.log("contracts")
    // console.log(JSON.stringify(contracts))
    console.log("initialTable")
    console.log(initialTable)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [searchedIndex, setSearchedIndex] = useState('')
    const [isGenerated, setIsGenerated] = useState(false)
    const [isFiltered, setIsFiltered] = useState(true)
    const [warning, setWarning] = useState(false)
    const [violations, setViolations] = useState("Warning: Contract Violations Detected")
    var page_size = 8
    const [showBackModal, setShowBackModal] = useState(false)
    const [renderInfo, setRenderInfo] = useState({ table: [["", "", "", "", "", ""]], colors: [], shiftsPerWorkers: {}, isGenerated: false, rowsToRender: {} })
    const [daySearch, setDaySearch] = useState({ value: "", shownValue: "Day" });
    const [skillSearch, setSkillSearch] = useState({ value: "", shownValue: "Skill" });
    const [fromSearch, setFromSearch] = useState({ value: "", shownValue: "From" });
    const [untilSearch, setUntilSearch] = useState({ value: "", shownValue: "Until" });
    const [assignedSearch, setAssignedSearch] = useState({ value: "", shownValue: "Worker" });
    const [shiftIndexSearch, setShiftIndexSearch] = useState({ value: "", shownValue: "Shift Number" });
    const [colorsModalShow, setColorsModalShow] = useState(false)
    const [options, setOptions] = useState({
        day: { options: [], shownOptions: [] },
        skill: { options: [], shownOptions: [] },
        from: { options: [], shownOptions: [] },
        until: { options: [], shownOptions: [] },
        assigned: { options: [], shownOptions: [] },
        shiftIndex: { options: [], shownOptions: [] }
    });
    const [linesFiltered, setLinesFiltered] = useState([])
    const [overlapInfo, setOverlapInfo] = useState("")
    const [contractInfo, setContractInfo] = useState("")
    const [changeInfo, setChangeInfo] = useState({})
    // console.log("shiftsInfo")
    // console.log(shiftsInfo)
    // console.log("workerMap")
    // console.log(workerMap)
    // console.log("shiftsPerWorkers")
    // console.log(shiftsPerWorkers)
    const defaultErrorMsg = "There are workers who work in 2 diffrent shifts at the same time."
    const [errorMsg, setErrorMsg] = useState(defaultErrorMsg)
    const token = user.token
    useEffect(() => {
        const newTable = [
            ...initialTable.Sunday,
            ...initialTable.Monday,
            ...initialTable.Tuesday,
            ...initialTable.Wednesday,
            ...initialTable.Thursday,
            ...initialTable.Friday,
            ...initialTable.Saturday
        ];
        var newColors = model.initialColors(initialTable, contracts)

        var newOptions = options
        newOptions.day = model.getDayOptions()
        newOptions.skill = model.getSkillOptions(user.skillList)
        newOptions.assigned = model.getWorkerList(user.table1)
        newOptions.shiftIndex = model.getShiftList(newTable)
        newOptions.from = model.getFromTimeList()
        newOptions.until = model.getUntilTimeList()

        setLinesFiltered(Array.from({ length: newTable.length }, (_, index) => index))
        setRenderInfo({ table: newTable, colors: newColors, shiftsPerWorkers: shiftsPerWorkers, isGenerated: true, rowsToRender: {} })
        setOptions(newOptions)
        setIsGenerated(true)
    }, []);

    function getLineInfo(absuluteIndex) {
        const {overlapMsg, contractMsg} = model.getLineInfo(absuluteIndex, renderInfo.table, renderInfo.colors, shiftsInfo, contracts, shiftsPerWorkers, initialTable)
        setOverlapInfo(overlapMsg)
        setContractInfo(contractMsg)
        const infoModal = new window.bootstrap.Modal(document.getElementById('infoModal'));
        infoModal.show()

    }

    function generateWorkerList(rowIndex, day) {
        return model.generateWorkerList(rowIndex, day, renderInfo.table, workerMap, shiftsInfo, contracts, renderInfo.shiftsPerWorkers, initialTable)
    }


    function handleCellEdit(newWorker, rowIndex) {
        const {newTable, newColors, newShiftPerWorkers, newChangeInfo} = model.edit(renderInfo.table,initialTable,rowIndex, renderInfo.colors, newWorker, contracts, renderInfo.shiftsPerWorkers, changeInfo)
        var newRowsToRender = {}
        var length = linesFiltered.length
        var endOfPage = Math.min(page_size + currentIndex - 1, length - 1)
        for (let i = currentIndex; i <= endOfPage; i++) {
            let absuluteIndex = linesFiltered[i]
            let rowChcked = renderInfo.table[absuluteIndex]
            newRowsToRender[linesFiltered[i]] = true
        }
        // console.log("newColors")
        // console.log(newColors)
        setRenderInfo({ table: newTable, colors: newColors, shiftsPerWorkers: newShiftPerWorkers, isGenerated: true, rowsToRender: newRowsToRender })
        setChangeInfo(newChangeInfo)
    }


    const handleSave = async () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
        setErrorMsg(defaultErrorMsg)
        const saveModal = new window.bootstrap.Modal(document.getElementById('saveModal'));
        var {isValid, isViolation, violations, isUnassigned} = model.getStatus(renderInfo.table, renderInfo.colors, contracts)
        var warningMsg = isUnassigned ? "There are some unassigned shifts.\n" : ""
        warningMsg += violations.join("\n")
        setViolations(warningMsg)
        setWarning(isViolation || isUnassigned)
        if (!isValid) {
            setErrorMsg(defaultErrorMsg)
            errorModal.show()
            return
        } else {
            saveModal.show()
        }
    };

    const handleErrorModalClose = () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
        errorModal.hide()
    };

    const handleSuccessModalClose = () => {
        const saveModal = new window.bootstrap.Modal(document.getElementById('saveModal'));
        saveModal.hide()
    };

    const handleBackModalClose = () => {
        setShowBackModal(false)
    }

    const finishEdit = async () => {
        var newUser = user
        newUser.algo2Table = initialTable
        newUser.contracts = contracts
        // console.log("initialTable")
        // console.log(initialTable)
        algo2api.postAlgo2Results(user.token, initialTable, changeInfo,() => { })
        setShiftsPerWorkers(renderInfo.shiftsPerWorkers)
        setUser(newUser)
        setInEdit(false)
        finishCallback()
    };

    const handleBack = () => {
        setShowBackModal(true)
    }

    const handleExit = () => {
        setInEdit(false)
    }

    const nextPage = () => {
        var newCurrentIndex = currentIndex
        var length = linesFiltered.length
        newCurrentIndex = newCurrentIndex + page_size
        var newRowsToRender = {}
        var end = Math.min(page_size + newCurrentIndex - 1, length - 1)
        for (let i = newCurrentIndex; i <= end; i++) {
            newRowsToRender[linesFiltered[i]] = true
        }
        setRenderInfo(prevRenderInfo => ({
            ...prevRenderInfo,
            rowsToRender: newRowsToRender
        }));
        setCurrentIndex(newCurrentIndex)
        setSearchedIndex('')
        document.getElementById('searchIndexInput').value = '';
    }

    const prevPage = () => {
        var oldCurrentIndex = currentIndex
        var newCurrentIndex = oldCurrentIndex - page_size
        var newRowsToRender = {}
        for (let i = newCurrentIndex; i < oldCurrentIndex; i++) {
            newRowsToRender[linesFiltered[i]] = true
        }
        setRenderInfo(prevRenderInfo => ({
            ...prevRenderInfo,
            rowsToRender: newRowsToRender
        }));
        setCurrentIndex(newCurrentIndex)
        setSearchedIndex('')
        document.getElementById('searchIndexInput').value = '';
    }

    const firstPage = () => {
        var oldCurrentIndex = currentIndex
        var newCurrentIndex = 0
        var length = linesFiltered.length
        var end = Math.min(page_size + newCurrentIndex - 1, length - 1)
        var newRowsToRender = {}
        for (let i = newCurrentIndex; i <= end; i++) {
            newRowsToRender[linesFiltered[i]] = true
        }

        setRenderInfo(prevRenderInfo => ({
            ...prevRenderInfo,
            rowsToRender: newRowsToRender
        }));
        setCurrentIndex(newCurrentIndex)
        setSearchedIndex('')
        document.getElementById('searchIndexInput').value = '';
    }

    const lastPage = () => {
        var length = linesFiltered.length
        var newCurrentIndex = Math.floor(length / page_size) * page_size
        if (newCurrentIndex == length) {
            newCurrentIndex = newCurrentIndex - page_size
        }
        var newRowsToRender = {}
        for (let i = newCurrentIndex; i < length; i++) {
            newRowsToRender[linesFiltered[i]] = true
        }
        setRenderInfo(prevRenderInfo => ({
            ...prevRenderInfo,
            rowsToRender: newRowsToRender
        }));
        setCurrentIndex(newCurrentIndex)
        setSearchedIndex('')
        document.getElementById('searchIndexInput').value = '';
    }

    const changeCurrentIndex = () => {
        var num = parseInt(searchedIndex)
        num = num - 1
        var indexNum = editAlgo2Utils.binarySearch(linesFiltered, num)
        var length = linesFiltered.length

        if (indexNum < 0 || indexNum >= renderInfo.table.length) {
            const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
            setErrorMsg("Index was not found in the filtered lines")
            errorModal.show()
            return
        }

        var newCurrentIndex = Math.floor(indexNum / page_size) * page_size
        var end = Math.min(page_size + newCurrentIndex - 1, length - 1)
        var newRowsToRender = {}
        for (let i = newCurrentIndex; i <= end; i++) {
            newRowsToRender[linesFiltered[i]] = true
        }
        setRenderInfo(prevRenderInfo => ({
            ...prevRenderInfo,
            rowsToRender: newRowsToRender
        }));
        setCurrentIndex(newCurrentIndex)
        setSearchedIndex('')
        document.getElementById('searchIndexInput').value = '';
    }

    const changeSelectedDay = (newDayIndex) => {
        var newDaySearch = { value: (options.day.options)[newDayIndex], shownValue: (options.day.shownOptions)[newDayIndex] }
        setDaySearch(newDaySearch)
    }

    const changeSelectedSkill = (newSkillIndex) => {
        var newSkillSearch = { value: (options.skill.options)[newSkillIndex], shownValue: (options.skill.shownOptions)[newSkillIndex] }
        setSkillSearch(newSkillSearch)
    }

    const changeSelectedWorker = (newWorkerIndex) => {
        var newAssignedSearch = { value: (options.assigned.options)[newWorkerIndex], shownValue: (options.assigned.shownOptions)[newWorkerIndex] }
        setAssignedSearch(newAssignedSearch)
    }

    const changeSelectedShift = (newShiftIndex) => {
        var newShiftIndexSearch = { value: (options.shiftIndex.options)[newShiftIndex], shownValue: (options.shiftIndex.shownOptions)[newShiftIndex] }
        setShiftIndexSearch(newShiftIndexSearch)
    }

    const changeSelectedFrom = (newFromIndex) => {
        var newSearch = { value: (options.from.options)[newFromIndex], shownValue: (options.from.shownOptions)[newFromIndex] }
        setFromSearch(newSearch)
    }

    const changeSelectedUntil = (newUntilIndex) => {
        var newSearch = { value: (options.until.options)[newUntilIndex], shownValue: (options.until.shownOptions)[newUntilIndex] }
        setUntilSearch(newSearch)
    }

    const filterButtonHandler = async () => {
        setIsFiltered(false)
    }

    const filterTable = async () => {
        await utils.sleep(1)
        var newRowsToRender = {}
        const table = renderInfo.table
        const colors = renderInfo.colors
        var newLinesFiltered = model.filter(table, daySearch, skillSearch, fromSearch, untilSearch, assignedSearch, shiftIndexSearch, colors)
        setCurrentIndex(0)
        setSearchedIndex('')
        document.getElementById('searchIndexInput').value = '';
        for (let lineInd of newLinesFiltered) {
            newRowsToRender[lineInd] = true
        }
        setLinesFiltered(newLinesFiltered)
        setRenderInfo(prevRenderInfo => ({
            ...prevRenderInfo,
            rowsToRender: newRowsToRender
        }));
        setIsFiltered(true)
    }


    const searchDayElement = (width) => {
        return (<SearchDropdown value={daySearch.value} shownValue={daySearch.shownValue} options={options.day.options} shownOptions={options.day.shownOptions} onSelect={changeSelectedDay} width={width} />)
    }

    const searchSkillElement = (width) => {
        return (<SearchDropdown value={skillSearch.value} shownValue={skillSearch.shownValue} options={options.skill.options} shownOptions={options.skill.shownOptions} onSelect={changeSelectedSkill} width={width} />)
    }

    const searchFromElement = (width) => {
        return (<SearchDropdown value={fromSearch.value} shownValue={fromSearch.shownValue} options={options.from.options} shownOptions={options.from.shownOptions} onSelect={changeSelectedFrom} width={width} />)
    }

    const searchUntilElement = (width) => {
        return (<SearchDropdown value={untilSearch.value} shownValue={untilSearch.shownValue} options={options.until.options} shownOptions={options.until.shownOptions} onSelect={changeSelectedUntil} width={width} />)
    }
    const searchAssignedElement = (width) => {
        return (<SearchDropdown value={assignedSearch.value} shownValue={assignedSearch.shownValue} options={options.assigned.options} shownOptions={options.assigned.shownOptions} onSelect={changeSelectedWorker} width={width} />)
    }

    const searchShiftIndexElement = (width) => {
        return (<SearchDropdown value={shiftIndexSearch.value} shownValue={shiftIndexSearch.shownValue} options={options.shiftIndex.options} shownOptions={options.shiftIndex.shownOptions} onSelect={changeSelectedShift} width={width} />)
    }

    const indexSearchElement = () => {
        return (
            <div style={{ position: 'relative', display: 'inline-block', width: "100%" }}>
                <input
                    name="searchIndex"
                    id="searchIndexInput"
                    type="text"
                    onChange={handleInputChange}
                    placeholder={"Index"}
                    style={{
                        paddingRight: '30px', // Adjust padding to accommodate the button
                        height: '4.5vh',
                        minHeight: '35px', // Match the height of the button
                        boxSizing: 'border-box', // Ensure padding is included in the height calculation
                        verticalAlign: 'middle', // Align input vertically with the button
                        maxWidth: '100%', // Limit the width to accommodate the button
                        backgroundColor: "white", // Set the background color to inherit to prevent changes
                        border: '1px solid black'
                    }}
                />

                <button
                    style={{
                        position: 'absolute',
                        top: '50%', // Position button at 50% from the top
                        transform: 'translateY(-50%)', // Translate button up by 50% of its own height
                        right: 10,
                        width: '30px', // Adjust button width as needed
                        height: '30px', // Make button height same as input field
                        border: '1px solid transparent', // Set border to transparent
                        background: 'transparent', // Add background style
                        padding: 0, // Remove padding
                        display: 'flex', // Use flexbox to center content
                        alignItems: 'center', // Center vertically
                        justifyContent: 'center', // Center horizontally
                        outline: 'none' // Remove outline border
                    }}
                    onClick={changeCurrentIndex}
                >
                    <img src={search} alt="Search" style={{ maxWidth: '100%', maxHeight: '20px', background: 'transparent' }} />
                </button>

            </div>
        );
    };

    const handleInputChange = (event) => {
        const { value } = event.target;
        const regex = /^[0-9]+$/;
        if (regex.test(value) || value == "") {
            setSearchedIndex(value);
        } else {
            document.getElementById('searchIndexInput').value = searchedIndex
        }
    };



    const filterButton = () => {
        return (<button onClick={filterButtonHandler} style={{ background: 'white', border: '2px solid black' }}>
            Apply Search&nbsp;<img src={search} alt="Search" style={{ width: '25px', height: '25px' }} />
        </button>)
    }


    const squareStyle = {
        width: '20px',
        height: '20px',
        display: 'inline-block',
        marginRight: '10px'
    };

    return (
        <div id="edit-file">
            <div className="container-fluid py-3">
                <div className="row" style={{ position: "fixed", top: "1%", height: "5%", width: "100%" }}>
                    <div className="col-2">
                        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#backModal" onClick={handleBack}>Back</button>
                    </div>
                    <div className="col-3"></div>
                    <div className="col-2 d-flex justify-content-center" style={{ marginBottom: "20px" }}>
                        {filterButton()}
                    </div>
                    <div className="col-4"></div>
                    <div className="col-1">
                        <Button
                            variant="info"
                            style={{ width: "50px", backgroundColor: "white", border: "none" }}
                            onClick={() => setColorsModalShow(true)}
                        >
                            <FontAwesomeIcon
                                icon={faQuestionCircle}
                                style={{ color: "black", fontSize: "24px" }}
                            />
                        </Button>
                    </div>
                </div>
                <div className="col-12" style={{ position: "fixed", top: "8%", left: "0%" }}>
                    {renderInfo.isGenerated && (<Table indexSearchElement={indexSearchElement} linesFiltered={linesFiltered} content={renderInfo.table} start={currentIndex} pageSize={page_size} colors={renderInfo.colors} rowsToRender={renderInfo.rowsToRender} shiftsPerWorker={renderInfo.shiftsPerWorkers}
                        workerMap={workerMap} shiftsInfo={shiftsInfo} onCellEdit={handleCellEdit} generateWorkerList={generateWorkerList} getLineInfo={getLineInfo} searchDayElement={searchDayElement}
                        searchSkillElement={searchSkillElement} searchFromElement={searchFromElement} searchUntilElement={searchUntilElement} searchAssignedElement={searchAssignedElement} searchShiftIndexElement={searchShiftIndexElement}></Table>)}
                </div>
                <br></br>
                <div className="row" style={{ position: "fixed", top: "86.5%", width: "100%" }}>
                    <div className="col-2"></div>
                    <div className="col-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button onClick={firstPage} disabled={currentIndex === 0} style={{ background: 'white', border: '2px solid black' }}>
                            <img src={end} alt="End" style={{ width: '25px', height: '25px', filter: currentIndex === 0 ? 'blur(2px)' : 'none' }} />
                        </button>
                        <button onClick={prevPage} disabled={currentIndex === 0} style={{ background: 'white', border: '2px solid black' }}>
                            <img src={left} alt="Left" style={{ width: '25px', height: '25px', filter: currentIndex === 0 ? 'blur(2px)' : 'none' }} />
                        </button>
                        <button onClick={nextPage} disabled={currentIndex + page_size >= linesFiltered.length} style={{ background: 'white', border: '2px solid black' }}>
                            <img src={right} alt="Right" style={{ width: '25px', height: '25px', filter: currentIndex + page_size >= linesFiltered.length ? 'blur(2px)' : 'none' }} />
                        </button>
                        <button onClick={lastPage} disabled={currentIndex + page_size >= linesFiltered.length} style={{ background: 'white', border: '2px solid black' }}>
                            <img src={start} alt="Start" style={{ width: '25px', height: '25px', filter: currentIndex + page_size >= linesFiltered.length ? 'blur(2px)' : 'none' }} />
                        </button>
                    </div>

                    <div className="col-2"></div>
                </div>
                <br></br>
                <div className="row" style={{ position: "fixed", top: "93%", width: "100%" }}>
                    <div className="col-2"></div>
                    <button className="btn btn-success col-8" onClick={handleSave}
                        data-toggle="modal" style={{ position: "fixed", width: "30%", height: "4%", left: "35%", fontSize: "15px", minHeight: "35px" }}>Save</button>
                    <div className="col-2">
                    </div>
                </div>



            </div>

            {!isGenerated && <Loader speed={5} customText="Calculating..." />}

            <FilterTableLoader initialValue={isFiltered} callBack={filterTable}></FilterTableLoader>
            <div className="modal fade" id="infoModal" tabIndex="-1" role="dialog" aria-labelledby="largeModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-side" role="document">
                    <div className="modal-content" style={{ backgroundColor: "white" }}>
                        <div className="modal-header">
                            <img src={infoImg} className="img-fluid mr-2" alt="Image 3" style={{ width: "auto", height: "40px" }} />
                            <h4 className="modal-title" id="largeModalLabel">Row Error/Warning Info</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-1">
                                    <img src={overlapImg} className="img-fluid mb-3" alt="Image 1" style={{ width: "auto", height: "40px" }} />
                                </div>
                                <div className="col-md-11">
                                    <h5>{overlapInfo}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-1">
                                    <img src={contractImg} className="img-fluid mb-3" alt="Image 2" style={{ width: "auto", height: "40px" }} />
                                </div>
                                <div className="col-md-11">
                                    <h5>{contractInfo}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
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
            {true && (
                <div class="modal fade show" id="errModal" tabindex="-1" role="dialog" aria-labelledby="saveModal" aria-hidden="true" onHide={handleErrorModalClose} style={{ whiteSpace: 'pre-line' }}>
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content modal-danger"> {/* Add custom class modal-danger */}
                            <div class="modal-header">
                                <h5 class="modal-title text-danger" id="saveModalLongTitle">Cannot Save Changes</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-danger"> {/* Add text-danger for red text */}
                                {errorMsg}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Go Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {true && (
                <div className={`modal fade show ${warning ? "modal-warning" : "modal-success"}`} id="saveModal" tabindex="-1" role="dialog" aria-labelledby="saveModal" aria-hidden="true" onHide={handleSuccessModalClose}>
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class={`modal-content ${warning ? "modal-warning" : "modal-success"}`}> {/* Add custom class modal-warning or modal-success */}
                            <div class="modal-header">
                                <h5 class={`modal-title ${warning ? "text-warning" : "text-success"}`} id="saveModalLongTitle">{warning ? "Warning" : "Changes Saved Successfully"}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class={`modal-body ${warning ? "text-warning" : "text-success"}`} style={{ whiteSpace: 'pre-wrap' }}>{/* Add text-warning or text-success for dynamic text color */}
                                {warning ? violations : "Your changes have been saved successfully."}
                            </div>
                            <div class="modal-footer">
                                <div className="d-flex justify-content-between w-100">
                                    <button type="button" class={`btn ${warning ? "btn-warning" : "btn-success"}`} data-dismiss="modal" onClick={finishEdit}>{warning ? "Continue Anyway" : "Finish"}</button>
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Keep Editing</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Modal show={colorsModalShow} onHide={() => setColorsModalShow(false)} centered>
                <Modal.Header>
                    <Modal.Title>Colors Information</Modal.Title>
                    <button type="button" className="close" onClick={() => setColorsModalShow(false)} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ ...squareStyle, backgroundColor: 'red' }}></div>
                        <span>Overlapping lines</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ ...squareStyle, backgroundColor: 'orange' }}></div>
                        <span>More hours than contract allows to</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ ...squareStyle, backgroundColor: 'yellow' }}></div>
                        <span>Less hours than contract allows to</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ ...squareStyle, backgroundColor: 'green' }}></div>
                        <span>Recommended - selecting the worker fulfills his contract</span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setColorsModalShow(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>)
}