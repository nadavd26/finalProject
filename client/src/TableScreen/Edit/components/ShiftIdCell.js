export default function ShiftIdCell({ value, rowIndex, columnIndex, color, additionalClass }) {
    // Define the styles outside of the JSX
    const cellStyle = columnIndex === 0  ? { borderLeftWidth: '1px' } : { borderLeftWidth: '0px' };
    var finalColor = color ? color : "white"
    var finalColor = "white"
    // if (color == "red") {
    //     if (value % 2 == 0) {
    //         finalColor = "pink"
    //     }
    // } else {
        if (value % 2 == 1) {
            finalColor = "gray"
        }
    // }
    return (
        <td
            id={(columnIndex == undefined || columnIndex == 0) ? 'first-column' : ''}
            className={`cell100 ${(columnIndex == 0  || columnIndex == undefined)? 'first-columns' : 'last-columns'} ${finalColor} ${additionalClass}`}
            style={cellStyle} // Apply the style object here
            contentEditable="false"
        >
            <h4>{value}</h4>
        </td>
    );
}


