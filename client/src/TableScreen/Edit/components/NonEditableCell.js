export default function NonEditableCell({ value, rowIndex, shiftIndex ,columnIndex, color, additionalClass }) {
    // Define the styles outside of the JSX
    const cellStyle = columnIndex === 0  ? { borderLeftWidth: '1px' } : { borderLeftWidth: '0px' };
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

    return (
        <td
            id={(columnIndex == undefined || columnIndex == 0) ? 'first-column' : ''}
            className={`cell100 ${(columnIndex == 0  || columnIndex == undefined)? 'first-columns' : 'last-columns'} ${finalColor} ${additionalClass}`}
            style={cellStyle} // Apply the style object here
            contentEditable="false"
        >
            {value}
        </td>
    );
}


