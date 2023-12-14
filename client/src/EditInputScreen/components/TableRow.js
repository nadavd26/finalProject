import { useState } from "react";
import rowDeleteImage from '../Images/deleteRow.png'
import rowAddImage from '../Images/addRow.png'
import "../css/TableRow.css"; // Import your CSS file for styling

export default function TableRow({ row, rowIndex, onCellEdit, onRowDelete, onRowAdd, firstRow }) {
    const [oldValue, setOldValue] = useState("");
    const [rowTransparent, setRowTransparent] = useState("")

    const handleFocus = (index, value) => {
        setOldValue(value);
        // Add a class to change the background color when focused
        document.getElementById(`cell-${rowIndex}-${index}`).classList.add("focused-cell");
    };

    const handleCellEdit = (columnIndex, value, e) => {
        // Remove the class when focus is lost
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.remove("focused-cell");

        if (firstRow[columnIndex].validate(value)) {
            onCellEdit(rowIndex, columnIndex, value);
        } else {
            e.preventDefault();
            e.target.innerText = oldValue;
        }
    };

    const handleDeleteRow = () => {
        setRowTransparent("transparent")
        onRowDelete(rowIndex)
    }

    const handleAddRow = () => {
        setRowTransparent("")
        onRowAdd(rowIndex)
    }

    if (row.length === 0) {
        return null; // Return null if the row is empty
    }

    return (
        <>
            <tr className="row100 body last-rows">
                {row.map((value, index) => (
                    <td
                        key={index}
                        id={`cell-${rowIndex}-${index}`}
                        className={`cell100 ${index === 0 ? 'first-column' : 'last-columns'} ${rowTransparent}`}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleCellEdit(index, e.target.innerText, e)}
                        onFocus={(e) => handleFocus(index, e.target.innerText)}
                        contentEditable={true}
                    >
                        {value}
                    </td>
                ))}
                {rowTransparent === "" ? (<td id="deleteRow">
                    <button className="btn btn-sm border-0 p-0" onClick={handleDeleteRow}>
                        <img src={rowDeleteImage} alt="Image" className="img-fluid" />
                    </button>
                </td>) :
                    <td id="addRow">
                        <button className="btn btn-sm border-0 p-0" id="deleteRow" onClick={handleAddRow}>
                            <img src={rowAddImage} alt="Image" className="img-fluid" />
                        </button>
                    </td>}
            </tr>
        </>
    );
}
