function DayDropdown() {
    let days = ["Sunday" ,"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return <select>
            <option value={days[0].toLowerCase()}>{days[0]}</option>
            <option value={days[1].toLowerCase()}>{days[1]}</option>
            <option value={days[2].toLowerCase()}>{days[2]}</option>
            <option value={days[3].toLowerCase()}>{days[3]}</option>
            <option value={days[4].toLowerCase()}>{days[4]}</option>
            <option value={days[5].toLowerCase()}>{days[5]}</option>
            <option value={days[6].toLowerCase()}>{days[6]}</option>
        </select>
}

export default DayDropdown