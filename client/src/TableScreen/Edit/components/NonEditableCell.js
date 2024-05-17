export default function NonEditableCell({ value, rowIndex, shiftIndex, columnIndex, color, additionalClass, style }) {
    // Define the styles outside of the JSX
    // console.log("color" + color)
    const cellStyle = columnIndex === 0 ? { borderLeftWidth: '1px' } : { borderLeftWidth: '0px' };
    var finalColor = color ? color : "white"
    if (color == "redorange") {
        finalColor = "red"
    }
    
    // console.log("finalcolor " + finalColor)
    

    const merge = { ...cellStyle, ...style }

    return (
        <td
            id={(columnIndex == undefined || columnIndex == 0) ? 'first-column' : ''}
            className={`cell100 ${(columnIndex == 0 || columnIndex == undefined) ? 'first-columns' : 'last-columns'} ${finalColor} ${additionalClass}`}
            style={merge} // Apply the style object here
            contentEditable="false"
        >
            {value}
        </td>
    );
}


