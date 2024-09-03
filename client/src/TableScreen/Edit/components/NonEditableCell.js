export default function NonEditableCell({ value, rowIndex, shiftIndex, columnIndex, color, additionalClass, style }) {
    // Define the styles outside of the JSX
    // 
    const cellStyle = columnIndex === 0 ? { borderLeftWidth: '1px' } : { borderLeftWidth: '0px' };
    var finalColor = color ? color : "white"
    if (color) {
        if (color.includes("red")) {
            finalColor = "red"
        } else {
            if (color.includes("orange")) {
                finalColor = "orange"
            } else {
                if (color.includes("yellow")) {
                    finalColor = "yellow"
                }
            }
        }
    }

    
    // 
    

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


