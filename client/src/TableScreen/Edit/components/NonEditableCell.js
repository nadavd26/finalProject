export default function NonEditableCell({ value, rowIndex, shiftIndex ,columnIndex, color, additionalClass, style }) {
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

    const merge = {...cellStyle, ...style}

    return (
        <td
            id={(columnIndex == undefined || columnIndex == 0) ? 'first-column' : ''}
            className={`cell100 ${(columnIndex == 0  || columnIndex == undefined)? 'first-columns' : 'last-columns'} ${color} ${additionalClass}`}
            style={merge} // Apply the style object here
            contentEditable="false"
        >
            {value}
        </td>
    );
}


