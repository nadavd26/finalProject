export default function FreeEditCell({value, rowIndex, columnIndex, isValid, onEdit, enableEdit}) {
    const handleOnFocus = () => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.add("focused-cell");
    };

    const handleOnBlur = (value) => {
        document.getElementById(`cell-${rowIndex}-${columnIndex}`).classList.remove("focused-cell");
        onEdit(rowIndex, columnIndex, value)
    }

    return <td
        id={`cell-${rowIndex}-${columnIndex}`}
        className={`cell100 last-columns ${isValid ? 'red' : ''}`}
        contentEditable={enableEdit}
        onBlur={(e) => handleOnBlur(e.target.innerText)}
        onFocus={(e) => handleOnFocus()}>
        {value}
    </td>
}