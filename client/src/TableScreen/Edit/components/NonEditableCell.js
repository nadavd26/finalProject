export default function NonEditableCell({ value, rowIndex, columnIndex, color, additionalClass }) {
    // Define the styles outside of the JSX
    const cellStyle = columnIndex === 0  ? { borderLeftWidth: '1px' } : { borderLeftWidth: '0px' };

    return (
        <td
            id={(columnIndex == undefined || columnIndex == 0) ? 'first-column' : ''}
            className={`cell100 ${(columnIndex == 0  || columnIndex == undefined)? 'first-columns' : 'last-columns'} ${color} ${additionalClass}`}
            style={cellStyle} // Apply the style object here
            contentEditable="false"
        >
            {value}
        </td>
    );
}


