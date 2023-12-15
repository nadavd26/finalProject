import rowDeleteImage from '../Images/deleteRow.png'
import rowAddImage from '../Images/addRow.png'
import "../css/TableRow.css"; // Import your CSS file for styling

export default function TableRow({ row, rowIndex, onCellEdit, onRowDelete, onRowAdd, firstRow }) {
    var oldValue = ""
    const handleFocus = (index, value) => {
        oldValue = value
        document.getElementById(`cell-${rowIndex}-${index}`).classList.add("focused-cell");
    };

    const handleCellEdit = (columnIndex, value, e) => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.remove("focused-cell");

        if (firstRow[columnIndex].validate(value)) {
            onCellEdit(rowIndex, columnIndex, value);
        } else {
            e.preventDefault();
            e.target.innerText = oldValue;
        }
    };

    const handleDeleteRow = () => {
        onRowDelete(rowIndex)
    }

    const handleAddRow = () => {
        onRowAdd(rowIndex)
    }
    console.log("row is: " + row)

    if (row.length === 0) {
        return null; // Return null if the row is empty
    }

    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
            {/* <td id="deleteRow" className='cell100 first-column'></td> */}
                {!row.deleted ? (<td id="deleteRow" className='cell100 first-column static-position '>
                    <button className="border-0 p-0 no-outline" onClick={handleDeleteRow} id="deleteBtn">
                        <img src={rowDeleteImage} alt="Image" className="img-fluid" id="deleteImg"/>
                    </button>
                </td>) :
                    <td id="addRow" className='cell100 first-column static-position'>
                        <button className="btn btn-sm border-0 p-0 no-outline" onClick={handleAddRow}>
                            <img src={rowAddImage} alt="Image" className="img-fluid" />
                        </button>
                    </td>}
                {row.value.map((value, index) => (
                    <td
                        key={index}
                        id={`cell-${rowIndex}-${index}`}
                        className={`cell100 ${index === 0 ? 'second-column' : 'last-columns'} ${row.deleted ? 'transparent' : ''}`}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleCellEdit(index, e.target.innerText, e)}
                        onFocus={(e) => handleFocus(index, e.target.innerText)}
                        contentEditable={row.deleted ? false : true}
                    >
                        {value}
                    </td>
                ))}

            </tr>
        </>
    );
}
