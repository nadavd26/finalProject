import React from 'react';

export default function WorkerDropdown({ value, rowIndex, coloumnIndex, workerList, onCellEdit, color }) {
    // console.log("row " + rowIndex + " re-rendered")

    var startIndex = value == "" ? 0 : 1
    var shownValue = value
    if (value == "") {
        shownValue = "not selected";
    }
    const handleOnBlur = () => {
        document.getElementById(`cell-${rowIndex}-${coloumnIndex}`).classList.remove("focused-cell");
    }

    const handleFocus = () => {
        document.getElementById(`cell-${rowIndex}-${coloumnIndex}`).classList.add("focused-cell");
    };

    return (
        <td id={`cell-${rowIndex}-${coloumnIndex}`} className={`cell100 last-columns ${color}`} onBlur={handleOnBlur} onFocus={handleFocus}>
            <select id={`selectWorker-${rowIndex}`} value={value} onChange={(e) => onCellEdit(e.target.value, rowIndex)}>
                <option value={value} hidden>{shownValue}</option>
                {value !== "" && (
                    <option key={0} value={""}>
                        not selected
                    </option>
                )}
                {workerList.map((worker, index) => (
                    <option key={startIndex + index} value={worker.name + "," + worker.id + "," + worker.color} style={{ backgroundColor: worker.color }}>
                        {worker.name + "\n" + worker.id}
                    </option>
                ))}
            </select>
        </td>
    );
}
