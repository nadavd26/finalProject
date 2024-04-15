import React from 'react';

export default function WorkerDropdown({ value, rowIndex, coloumnIndex, workerList, onEdit, color }) {
    if (value == "") {
        value = "not selected";
    }
    const handleOnBlur = () => {
        document.getElementById(`cell-${rowIndex}-${coloumnIndex}`).classList.remove("focused-cell");
    }

    const handleFocus = () => {
        document.getElementById(`cell-${rowIndex}-${coloumnIndex}`).classList.add("focused-cell");
    };

    return (
        <td id={`cell-${rowIndex}-${coloumnIndex}`} className={`cell100 last-columns ${color}`} onBlur={handleOnBlur} onFocus={handleFocus}>
            <select id={`selectWorker-${rowIndex}`} value={value} onChange={(e) => onEdit(e.target.value)}>
                <option value={value} hidden>{value}</option>
                {workerList.map((worker, index) => (
                    <option key={index} value={worker.name + "," +worker.id + "," + worker.color} style={{ backgroundColor: worker.color }}>
                        {worker.name + "\n" + worker.id}
                    </option>
                ))}
            </select>
        </td>
    );
}
