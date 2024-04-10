function SkillDropdown({ currentSkill , skillList, handlerSkill }) {
    return (
        <div className="dropdown">
            <button className="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {currentSkill}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {skillList.map((skill, index) => (
                    <button key={index} className="dropdown-item changeDayButton" onClick={() => handlerSkill(skill)}>{skill}</button>
                ))}
            </div>
        </div>
    );
}

export default SkillDropdown;
