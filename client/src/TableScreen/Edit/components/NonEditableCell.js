export default function NonEditableCell({ value, rowIndex, columnIndex }) {
    // Define the styles outside of the JSX
    const cellStyle = columnIndex === 0 ? { borderLeftWidth: '1px' } : { borderLeftWidth: '0px' };

    return (
        <td
            id={columnIndex == undefined ? 'first-col' : ''}
            // id={`cell-${rowIndex}-${columnIndex}`}
            className={`cell100 ${columnIndex == 0 ? 'first-columns' : 'last-columns'}`}
            style={cellStyle} // Apply the style object here
            contentEditable="false"
        >
            {value}
        </td>
    );
}


