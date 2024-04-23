import React from 'react';
import info from '../Images/info.png';
export default function WorkerDropdown({ value, rowIndex, coloumnIndex, workerList, onCellEdit, color, shiftIndex, getLineInfo }) {
    // console.log("row " + rowIndex + " re-rendered")
    const buttonStyle = {
        visibility: color === 'white' ? 'hidden' : 'visible'
    };
    var finalColor = color ? color : "white"
    if (color == "red") {
        if (shiftIndex % 2 == 0) {
            finalColor = "pink"
        }
    } else {
        if (shiftIndex % 2 == 1) {
            finalColor = "gray"
        }
    }
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
        <td id={`cell-${rowIndex}-${coloumnIndex}`} className={`cell100 last-columns worker-dropdown ${color}`} onBlur={handleOnBlur} onFocus={handleFocus}>
            <div className="cell-content">
                <select id={`selectWorker-${rowIndex}`} value={value} onChange={(e) => onCellEdit(e.target.value, rowIndex)} style={{ backgroundColor: value !== "" ? "lightblue" : "transparent" }}>
                    <option value={value} hidden style={{ backgroundColor: "transparent" }}>{shownValue}</option>
                    {value !== "" && (
                        <option key={0} value={""} style={{ backgroundColor: "transparent" }}>
                            not selected
                        </option>
                    )}
                    {workerList.map((worker, index) => (
                        <option key={startIndex + index} value={worker.name + "," + worker.id + "," + worker.color} style={{ backgroundColor: worker.color }}>
                            {worker.name + "\n" + worker.id}
                        </option>
                    ))}
                </select>
                <button
                    className="border-0 p-0 no-outline actionButton"
                    onClick={() => getLineInfo(rowIndex)}
                    style={{ ...buttonStyle}} // Apply button style dynamically and add margin
                >
                    <img src={info} alt="Info Icon" className="img-fluid actionImage" />
                </button>
            </div>
        </td>
    );
    
}
