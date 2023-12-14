//first row : [{name : , validate : function}, ....]
export default function TableRow({ row, rowIndex, onCellEdit, firstRow }) {
    var oldValue = ""
    const handleFocus = (index, value) => {
        oldValue = value
    }
    const handleCellEdit = (columnIndex, value, e) => {
        if (firstRow[columnIndex].validate(value)) {
            onCellEdit(rowIndex, columnIndex, value);
        } else {
            e.preventDefault();
            e.target.innerText = oldValue
        }
    };

    if (row.length === 0) {
        return null; // Return null if the row is empty
    }

    return (
        <tr className="row100 body last-rows">
            {row.map((value, index) => (
                <td
                    key={index}
                    className={`cell100 ${index === 0 ? 'first-column' : 'last-columns'} gray`}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleCellEdit(index, e.target.innerText, e)}
                    onFocus={(e) => handleFocus(index, e.target.innerText)}
                    contentEditable={true}
                >
                    {value} 
                </td>
            ))}
        </tr>
    );
}
