export default function DayCell({ value, rowIndex, coloumnIndex, isValid, onEdit }) {
    const handleOnBlur = () => {
        document.getElementById(`cell-${rowIndex}-${coloumnIndex}`).classList.remove("focused-cell");
    }

    const handleFocus = () => {
        document.getElementById(`cell-${rowIndex}-${coloumnIndex}`).classList.add("focused-cell");
    };
    return <td id={`cell-${rowIndex}-${coloumnIndex}`} className={`cell100 last-columns ${isValid ? 'red' : ''}`} onBlur={handleOnBlur}
        onFocus={handleFocus}>
        <select id={`selectDay-${rowIndex}`} value={value} onChange={(e) => onEdit(rowIndex, coloumnIndex, e.target.value)}>
            {["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].includes(value) ? (
                <>
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                </>
            ) : (
                <>
                    <option value={value} hidden>{value}</option>
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                </>
            )}
        </select>
    </td>
}