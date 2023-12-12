function Dropdown({ firstDay, dayHandler }) {
    let otherDays;

    switch (firstDay) {
        case "Sunday":
            otherDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            break;
        case "Monday":
            otherDays = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            break;
        case "Tuesday":
            otherDays = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday"];
            break;
        case "Wednesday":
            otherDays = ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"];
            break;
        case "Thursday":
            otherDays = ["Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
            break;
        case "Friday":
            otherDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
            break;
        case "Saturday":
            otherDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
            break;
        default:
            otherDays = [];
    }
    return <div className="dropdown col-2 d-flex justify-content-center">
        <button className="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {firstDay}
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <button className="dropdown-item changeDayButton" onClick={() => dayHandler(otherDays[0])}>{otherDays[0]}</button>
            <button className="dropdown-item changeDayButton" onClick={() => dayHandler(otherDays[1])}>{otherDays[1]}</button>
            <button className="dropdown-item changeDayButton" onClick={() => dayHandler(otherDays[2])}>{otherDays[2]}</button>
            <button className="dropdown-item changeDayButton" onClick={() => dayHandler(otherDays[3])}>{otherDays[3]}</button>
            <button className="dropdown-item changeDayButton" onClick={() => dayHandler(otherDays[4])}>{otherDays[4]}</button>
            <button className="dropdown-item changeDayButton" onClick={() => dayHandler(otherDays[5])}>{otherDays[5]}</button>
        </div>
    </div>
}

export default Dropdown