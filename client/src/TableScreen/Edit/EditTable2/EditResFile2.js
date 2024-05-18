import { useEffect, useMemo, useState } from "react";
import Table from "./Table";
import '../css/bootstrap.min.css'
import '../css/edit-file-table-main.css'
import '../css/perfect-scrollbar.css'
import * as utils from '../../Utils'
import overlapImg from '../Images/overlap.png'
import contractImg from '../Images/contract.png'
import infoImg from '../Images/info.png'
import right from '../Images/right.png'
import left from '../Images/left.png'
import search from '../Images/search.webp'
import start from '../Images/start.png'
import end from '../Images/end.png'
import Loader from "../../conponenets/Loader";
import SearchDropdown from "../components/SearchDropdown";
import filterTableLoader from "../components/FilterTableLoader";
import FilterTableLoader from "../components/FilterTableLoader";

export default function EditResFile2({ initialTable, setInEdit, user, setUser, workerMap, shiftsInfo, shiftsPerWorkers, setShiftsPerWorkers, finishCallback }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [searchedIndex, setSearchedIndex] = useState('')
    const [isGenerated, setIsGenerated] = useState(false)
    const [isFiltered, setIsFiltered] = useState(true)
    const [warning, setWarning] = useState(false)
    var page_size = 8
    const [showBackModal, setShowBackModal] = useState(false)
    const [renderInfo, setRenderInfo] = useState({ table: [["", "", "", "", "", ""]], colors: [], shiftsPerWorkers: {}, isGenerated: false, rowsToRender: {} })
    const [daySearch, setDaySearch] = useState({ value: "", shownValue: "Day" });
    const [skillSearch, setSkillSearch] = useState({ value: "", shownValue: "Skill" });
    const [fromSearch, setFromSearch] = useState({ value: "", shownValue: "From" });
    const [untilSearch, setUntilSearch] = useState({ value: "", shownValue: "Until" });
    const [assignedSearch, setAssignedSearch] = useState({ value: "", shownValue: "Worker" });
    const [shiftIndexSearch, setShiftIndexSearch] = useState({ value: "", shownValue: "Shift Number" });
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
    console.log("shiftsInfo")
    console.log(shiftsInfo)
    console.log("workerMap")
    console.log(workerMap)
    console.log("shiftsPerWorkers")
    console.log(shiftsPerWorkers)
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
        var newColors = Array.from({
            length: initialTable.Sunday.length + initialTable.Monday.length + initialTable.Tuesday.length +
                initialTable.Wednesday.length + initialTable.Thursday.length + initialTable.Friday.length + initialTable.Saturday.length
        }, () => "white")

        var newOptions = options
        newOptions.day = getDayOptions()
        newOptions.skill = getSkillOptions()
        newOptions.assigned = getWorkerList()
        newOptions.shiftIndex = getShiftList(newTable)
        newOptions.from = getFromTimeList()
        newOptions.until = getUntilTimeList()

        setLinesFiltered(Array.from({ length: newTable.length }, (_, index) => index))
        setRenderInfo({ table: newTable, colors: newColors, shiftsPerWorkers: shiftsPerWorkers, isGenerated: true, rowsToRender: {} })
        setOptions(newOptions)
        setIsGenerated(true)
    }, []);

    const getDayOptions = () => {
        return { options: ["", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], shownOptions: ["Any", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] }
    }

    const getSkillOptions = () => {
        const skillList = user.skillList
        var res = { options: ["", ...skillList], shownOptions: ["Any", ...skillList] }
        return res
    }

    const getWorkerList = () => {
        const workerList = utils.generateWorkerList(user.table1)
        var res = { options: ["", "+", "-", "$", ...workerList], shownOptions: ["Any", "Any Assigned Shift", "Any Unassigned Shift", "Lines With Conflicts", ...workerList] }
        return res
    }

    const getShiftList = (newTable) => {
        const uniqueShiftsShown = new Set();
        for (let i = 0; i < newTable.length; i++) {
            const shift = newTable[i][5];
            uniqueShiftsShown.add(shift + 1);
        }

        const shifts = Array.from(uniqueShiftsShown)
        var res = { options: ["", ...(shifts)], shownOptions: ["Any", ...(shifts)] };
        console.log("res");
        console.log(res); // Log the result
        return res;
    };

    const getFromTimeList = () => {
        const fromTimeList = [
            "00:00", "00:30",
            "01:00", "01:30",
            "02:00", "02:30",
            "03:00", "03:30",
            "04:00", "04:30",
            "05:00", "05:30",
            "06:00", "06:30",
            "07:00", "07:30",
            "08:00", "08:30",
            "09:00", "09:30",
            "10:00", "10:30",
            "11:00", "11:30",
            "12:00", "12:30",
            "13:00", "13:30",
            "14:00", "14:30",
            "15:00", "15:30",
            "16:00", "16:30",
            "17:00", "17:30",
            "18:00", "18:30",
            "19:00", "19:30",
            "20:00", "20:30",
            "21:00", "21:30",
            "22:00", "22:30",
            "23:00", "23:30"
        ];

        const res = { options: ["", ...fromTimeList], shownOptions: ["Any", ...fromTimeList] }
        return res

    }

    const getUntilTimeList = () => {
        const UntilTimeList = [
            "00:30",
            "01:00", "01:30",
            "02:00", "02:30",
            "03:00", "03:30",
            "04:00", "04:30",
            "05:00", "05:30",
            "06:00", "06:30",
            "07:00", "07:30",
            "08:00", "08:30",
            "09:00", "09:30",
            "10:00", "10:30",
            "11:00", "11:30",
            "12:00", "12:30",
            "13:00", "13:30",
            "14:00", "14:30",
            "15:00", "15:30",
            "16:00", "16:30",
            "17:00", "17:30",
            "18:00", "18:30",
            "19:00", "19:30",
            "20:00", "20:30",
            "21:00", "21:30",
            "22:00", "22:30",
            "23:00", "23:30", "24:00"
        ];

        const res = { options: ["", ...UntilTimeList], shownOptions: ["Any", ...UntilTimeList] }
        return res

    }

    function getColor(id, name, day, row) {
        var color = "white"
        const shiftSet = utils.getShiftsForWorker((renderInfo.shiftsPerWorkers)[day], id, name);
        const shiftsWorker = getShifts(name + "\n" + id, shiftsPerWorkers)
        // console.log("shiftsWorker" + shiftsWorker)
        // console.log("numShifts")
        // console.log(numShifts)
        const contract = 2
        if (shiftsWorker.length + 1 > contract) { //selecting worker violates contract
            color = "orange"
        }
        for (const relativeIndex of shiftSet) {
            const absuluteIndex = getAbsuluteIndex(relativeIndex, day)
            const shiftRow = (renderInfo.table)[absuluteIndex];

            if (utils.checkOverlap(shiftRow[2], shiftRow[3], row[2], row[3])) {
                return color == "orange" ? "redorange" : "red"; // Return "red" if there's an overlap
            }
        }

        return color; // Return "white" if no overlap is found
    }


    function firstIndex(day) {
        var sum = 0;
        if (day === "Sunday") {
            return sum;
        }
        sum += initialTable.Sunday.length;
        if (day === "Monday") {
            return sum;
        }
        sum += initialTable.Monday.length;
        if (day === "Tuesday") {
            return sum;
        }
        sum += initialTable.Tuesday.length;
        if (day === "Wednesday") {
            return sum;
        }
        sum += initialTable.Wednesday.length;
        if (day === "Thursday") {
            return sum;
        }
        sum += initialTable.Thursday.length;
        if (day === "Friday") {
            return sum;
        }
        sum += initialTable.Friday.length;
        if (day === "Saturday") {
            return sum;
        }
    }

    function getShifts(worker, shiftsPerWorkers) {
        var shifts = []
        // const parts = inputString.split(',');
        // const worker = parts.slice(0, 2).join('\n');
        // console.log("worker")
        // console.log(worker)
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        for (let i = 0; i < days.length; i++) {
            var length = 0
            var workersDay = shiftsPerWorkers[days[i]]
            // console.log("workersDay")
            // console.log(workersDay)
            if (!!workersDay) {
                var workerDay = workersDay[worker]
                // console.log("workerDay")
                // console.log(workerDay)
                if (!!workerDay) {
                    workerDay.forEach((element) => shifts.push(getAbsuluteIndex(element, days[i])))
                }
            }
        }

        return shifts
    }




    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getLineInfo(absuluteIndex) {
        var overlapsLineNumbers = []
        var contractMsg = "No Contract Violation"
        const row = (renderInfo.table)[absuluteIndex]
        const day = capitalizeFirstLetter(row[0])
        const worker = row[4]
        if (renderInfo.colors[absuluteIndex] == "red" || renderInfo.colors[absuluteIndex] == "redorange") {
            const shiftsId = row[5]
            const shiftEntry = shiftsInfo[day][shiftsId]
            const overlaps = shiftEntry.overlaps
            for (const overlapId of overlaps) {
                if (overlapId == shiftsId) {
                    continue //same shift does not count as overlap
                }
                var overlapEntry = shiftsInfo[day][overlapId]
                var start = getAbsuluteIndex(overlapEntry.start, day)
                var end = getAbsuluteIndex(overlapEntry.end, day)
                for (let i = start; i <= end; i++) {
                    if ((renderInfo.table)[i][4] == worker) {
                        overlapsLineNumbers.push(i + 1) //numbers start from 1, not from 0
                    }
                }
            }
        }

        if (renderInfo.colors[absuluteIndex] == "orange" || renderInfo.colors[absuluteIndex] == "redorange") {
            var contract = 2
            var workerShifts = getShifts(worker, shiftsPerWorkers, 1)
            if (workerShifts.length > contract) {
                workerShifts = workerShifts.filter(item => item != (absuluteIndex))
                workerShifts = workerShifts.map((item, index) => item + 1);
                workerShifts.sort((a, b) => a - b);
                contractMsg = "Current contract " + contract + ", number of shifts " + (workerShifts.length + 1) + "." + "\nOther assigments of this worker at indexes: " + workerShifts.join(", ")
            }
        }

        console.log("overlapsLineNumbers")
        console.log(overlapsLineNumbers)
        var overlapMsg = "No overlapping shifts"
        if (overlapsLineNumbers.length > 0) {
            overlapMsg = "Overlapping shifts of this shift (index " + (absuluteIndex + 1) + ") at indexes: " + overlapsLineNumbers.join(", ")
        }
        setOverlapInfo(overlapMsg)
        setContractInfo(contractMsg)
        const infoModal = new window.bootstrap.Modal(document.getElementById('infoModal'));
        infoModal.show()

    }

    function generateWorkerList(rowIndex, day) {
        const row = (renderInfo.table)[rowIndex]
        // console.log("row")
        // console.log(row)
        const skill = row[1];
        if (workerMap.has(skill)) {
            const workerList = workerMap.get(skill);
            const unavaliableWorkers = []
            const start = (shiftsInfo[day][row[5]]).start + firstIndex(day)
            const end = (shiftsInfo[day][row[5]]).end + firstIndex(day)
            for (let i = start; i <= end; i++) {
                const nameId = ((renderInfo.table))[i][4]
                const [name, id] = (nameId).split("\n")
                unavaliableWorkers.push({ name: name, id: id })
            }
            const filteredWorkerList = workerList.filter(worker => {
                return !unavaliableWorkers.some(unavailable => {
                    return unavailable.id === worker.id;
                });
            });
            const transformedWorkerList = [];
            const [name, id] = row[4].split("\n");
            // console.log("filteredWorkerList")
            // console.log(filteredWorkerList)
            for (let i = 0; i < filteredWorkerList.length; i++) {
                const worker = filteredWorkerList[i]
                transformedWorkerList.push({
                    id: worker.id, // Assuming the worker object has an id property
                    name: worker.name, // Assuming the worker object has a name property
                    color: getColor(worker.id, worker.name, day, row)
                });
            }
            // console.log("transformedWorkerList")
            // console.log(transformedWorkerList)
            return transformedWorkerList; // Return the transformed worker list
        } else {
            // If the skill does not exist in the workerMap, return an empty list
            return [];
        }
    }

    function getAbsuluteIndex(relativeIndex, day) {
        return firstIndex(day) + relativeIndex
    }

    function getRelativeIndex(absuluteIndex, day) {
        return absuluteIndex - firstIndex(day)
    }

    function handleCellEdit(newWorker, rowIndex) {
        var newWorkerContract = 2
        var oldWorkerContract = 2
        const row = (renderInfo.table)[rowIndex]
        console.log("row")
        console.log(row)
        const day = capitalizeFirstLetter(row[0])
        var newTable = renderInfo.table
        const oldColor = (renderInfo.colors)[rowIndex]
        var newColors = renderInfo.colors
        var newRowsToRender = {}
        const [newName = "", newId = "", newColor = "white"] = newWorker.split(",")
        const [oldName, oldId] = (row[4]).split("\n")
        const oldWorker = oldName + "\n" + oldId

        var newShiftPerWorkersDay = newName != "" ? utils.addShiftToWorker((renderInfo.shiftsPerWorkers)[day], newId, newName, getRelativeIndex(rowIndex, day)) : (renderInfo.shiftsPerWorkers)[day]
        utils.removeShiftFromWorker(newShiftPerWorkersDay, oldId, oldName, getRelativeIndex(rowIndex, day))
        var newShiftPerWorkers = renderInfo.shiftsPerWorkers
        newShiftPerWorkers[day] = newShiftPerWorkersDay
        var oldWorkerShifts = getShifts(oldWorker, newShiftPerWorkers)
        newTable[rowIndex][4] = (newName == "") ? "" : newName + "\n" + newId
        newColors[rowIndex] = newColor
        if (newColor == "red" || newColor == "redorange") { //checking for overlapping shifts to color in red
            const shiftsOfNewWorker = utils.getShiftsForWorker((renderInfo.shiftsPerWorkers)[day], newId, newName)
            for (const relativeIndex of shiftsOfNewWorker) {
                const absuluteIndex = getAbsuluteIndex(relativeIndex, day)
                const from = (renderInfo.table)[absuluteIndex][2]
                const until = (renderInfo.table)[absuluteIndex][3]
                if (utils.checkOverlap(from, until, row[2], row[3])) { //overlaps with some shift of new worker
                    if (newColors[absuluteIndex] == "orange") {
                        newColors[absuluteIndex] = "redorange"
                    } else {
                        newColors[absuluteIndex] = "red"
                    }
                }
            }
        }

        if (oldColor == "red" || oldColor == "redorange") {//removing the overlaps of the old worker
            const shiftsOfOldWorker = utils.getShiftsForWorker(newShiftPerWorkersDay, oldId, oldName)
            for (const relativeIndex of shiftsOfOldWorker) {
                // console.log("relativeIndex")
                // console.log(relativeIndex)
                const absuluteIndex = getAbsuluteIndex(relativeIndex, day)
                const from = (renderInfo.table)[absuluteIndex][2]
                const until = (renderInfo.table)[absuluteIndex][3]
                if (utils.checkOverlap(from, until, row[2], row[3])) {
                    //found overlap, now need to check this is the only overlap in order to color it a "white"
                    var found = false
                    const shiftsOfOldWorker2 = shiftsOfOldWorker
                    for (const relativeIndex2 of shiftsOfOldWorker2) {
                        if (relativeIndex2 != relativeIndex) { //check overlap for other shift that isnt the shift we are checking
                            const absuluteIndex2 = getAbsuluteIndex(relativeIndex2, day)
                            const from2 = (renderInfo.table)[absuluteIndex2][2]
                            const until2 = (renderInfo.table)[absuluteIndex2][3]
                            if (utils.checkOverlap(from, until, from2, until2)) {
                                found = true
                            }
                        }
                    }

                    if (!found) { //only overlap it has it is with the original shift
                        if (newColors[absuluteIndex] == "redorange") {
                            newColors[absuluteIndex] = "orange"
                        }
                        else {
                            newColors[absuluteIndex] = "white"
                        }
                    }
                }
            }
        }


        const parts = newWorker.split(',');
        const newWorkerString = parts.slice(0, 2).join('\n');
        var newWorkerShifts = getShifts(newWorkerString, newShiftPerWorkers)
        if (newColor == "orange" || newColor == "redorange") {
            for (let i = 0; i < newWorkerShifts.length; i++) {
                const absuluteIndex = newWorkerShifts[i]
                if (newColors[absuluteIndex] == "white") {
                    newColors[absuluteIndex] = "orange"
                }
                if (newColors[absuluteIndex] == "red") {
                    newColors[absuluteIndex] = "redorange"
                }
            }
        }


        console.log("oldWorker")
        console.log(oldWorker)
        // console.log("oldWorkerShifts")
        //     console.log(oldWorkerShifts)
        if (oldColor == "orange" || oldColor == "redorange") { //now cheking if the removed worker obeys the contract
            console.log("old worker orange")
            console.log("oldWorkerShifts")
            console.log(oldWorkerShifts)
            var contract = 2
            if (oldWorkerShifts.length <= contract) { //removing this shift makes the contract valid
                for (let i = 0; i < oldWorkerShifts.length; i++) {
                    const absuluteIndex = oldWorkerShifts[i]
                    console.log("absuluteIndex")
                    console.log(absuluteIndex)
                    if (newColors[absuluteIndex] == "orange") {
                        newColors[absuluteIndex] = "white"
                    }
                    if (newColors[absuluteIndex] == "redorange") {
                        newColors[absuluteIndex] = "red"
                    }
                    newRowsToRender[absuluteIndex] = true
                }
            }
        }


        var newRowsToRender = {}
        var length = linesFiltered.length
        var endOfPage = Math.min(page_size + currentIndex - 1, length - 1)
        for (let i = currentIndex; i <= endOfPage; i++) {
            let absuluteIndex = linesFiltered[i]
            let rowChcked = renderInfo.table[absuluteIndex]
            if (capitalizeFirstLetter(rowChcked[0]) == day && (utils.checkOverlap(rowChcked[2], rowChcked[3], row[2], row[3]))) {
                newRowsToRender[linesFiltered[i]] = true
            }

            // console.log("workerMap.get(rowChcked[1])")
            // console.log(workerMap.get(rowChcked[1]))
            // console.log("{id: newId, name: newName}")
            // console.log({id: newId, name: newName})
            // console.log("workerMap.get(rowChcked[1]).indexOf({id: newId, name: newName})")
            // console.log(workerMap.get(rowChcked[1]).indexOf({id: newId, name: newName}))
            const objToFind = { id: newId, name: newName }
            if ((workerMap.get(rowChcked[1]).findIndex(obj => obj.id === objToFind.id && obj.name === objToFind.name) != -1) && newWorkerShifts.length >= newWorkerContract) { //need to render only if contract violation
                newRowsToRender[linesFiltered[i]] = true
            }

            const objToFind2 = { id: oldId, name: oldName }
            if ((workerMap.get(rowChcked[1]).findIndex(obj => obj.id === objToFind2.id && obj.name === objToFind2.name) != -1) && newWorkerShifts.length <= newWorkerContract) { //need to render only if contract becomes valid
                newRowsToRender[linesFiltered[i]] = true
            }

            // newRowsToRender[linesFiltered[i]] = true
        }

        console.log("newColors")
        console.log(newColors)
        //rendering copies of the same shift
        //rendering overlapping rows of this row
        setRenderInfo({ table: newTable, colors: newColors, shiftsPerWorkers: newShiftPerWorkers, isGenerated: true, rowsToRender: newRowsToRender })
    }


    const handleSave = async () => {
        const errorModal = new window.bootstrap.Modal(document.getElementById('errModal'));
        setErrorMsg(defaultErrorMsg)
        const saveModal = new window.bootstrap.Modal(document.getElementById('saveModal'));
        var isValid = true;
        var isWarning = false
        for (const color of renderInfo.colors) {
            if (color == "red" || color == "redorange") {
                isValid = false
            }

            if (color == "orange") {
                isWarning = true
            }
        }

        setWarning(isWarning)
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
        console.log("initialTable")
        console.log(initialTable)
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
        var indexNum = utils.binarySearch(linesFiltered, num)
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
        var newLinesFiltered = []
        var newRowsToRender = {}
        const table = renderInfo.table
        const colors = renderInfo.colors
        for (let i = 0; i < table.length; i++) {
            var goodLine = true
            const [day, skill, from, until, assigned, shiftIndex] = table[i]

            if (daySearch.value != "" && daySearch.value != day) {
                goodLine = false
            }
            if (skillSearch.value != "" && skillSearch.value != skill) {
                goodLine = false
            }
            if (fromSearch.value != "" && fromSearch.value != from) {
                goodLine = false
            }
            if (untilSearch.value != "" && untilSearch.value != until) {
                goodLine = false
            }
            if (assignedSearch.value != "" && assignedSearch.value != "+" && assignedSearch.value != "-" && assignedSearch.value != "$" && assignedSearch.value != assigned) {
                goodLine = false
            }

            if (assignedSearch.value == "$" && colors[i] == "white") {
                goodLine = false
            }

            if (assignedSearch.value == "+" && assigned == "") {
                goodLine = false
            }

            if (assignedSearch.value == "-" && assigned != "") {
                goodLine = false
            }
            if (shiftIndexSearch.value != "" && shiftIndexSearch.value - 1 != shiftIndex) {
                goodLine = false
            }

            if (goodLine) {
                newLinesFiltered.push(i)
                newRowsToRender[i] = true
            }
        }
        setCurrentIndex(0)
        setSearchedIndex('')
        document.getElementById('searchIndexInput').value = '';
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
            Apply Serach&nbsp;<img src={search} alt="Search" style={{ width: '25px', height: '25px' }} />
        </button>)
    }



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
                    <div className="col-5"></div>
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
                                <h5 class={`modal-title ${warning ? "text-warning" : "text-success"}`} id="saveModalLongTitle">{warning ? "Warning: Contract Violations Detected" : "Changes Saved Successfully"}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class={`modal-body ${warning ? "text-warning" : "text-success"}`}> {/* Add text-warning or text-success for dynamic text color */}
                                {warning ? "There are some contract violations. Are you sure you want to continue?" : "Your changes have been saved successfully."}
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




        </div>)
}