import React, { useRef, useLayoutEffect } from 'react'; // Add import for React
import '../css/scrollbar.css'

const FirstTableInfo = () => {
    const headerStyle = { backgroundColor: "rgb(60, 60, 60)", color: "white" }
    const bodyStyle = { backgroundColor: "white" }
    const ref = useRef()
    useLayoutEffect(() => {
        ref.current.style.setProperty("border-left-width", "1px", "important");
    }, []);
    const ref2 = useRef()
    useLayoutEffect(() => {
        ref2.current.style.setProperty("border-left-width", "1px", "important");
    }, []);
    return (
        <div className="container-table100" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="wrap-table100 scrollbarr" style={{ overflow: 'auto' }}>
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th class="cell100  first-column blue col-1" style={headerStyle} ref={ref}>Id</th>
                                    <th class="cell100  last-columns blue col-1" style={headerStyle}>Name</th>
                                    <th class="cell100  last-columns blue col-1" style={headerStyle}>Skill1</th>
                                    <th class="cell100  last-columns blue col-1" style={headerStyle}>Skill2</th>
                                    <th class="cell100  last-columns blue col-1" style={headerStyle}>Skill3</th>
                                    <th class="cell100  last-columns blue col-1" style={headerStyle}>Min Hours</th>
                                    <th class="cell100  last-columns blue col-1" style={headerStyle}>Max Hours</th>
                                </tr>
                                <td ref={ref2} style={bodyStyle}>- Only digits <br></br>
                                    - Maximum length of 10 characters</td>
                                <td style={bodyStyle}>- Only letters, spaces, and apostrophes <br></br>
                                    - Maximum length of 25 characters
                                </td>
                                <td style={bodyStyle}>- Use only letters, spaces, quotes, hyphens, pound signs, slashes, and dots. <br></br>
                                    - Keep it under 40 characters in length.</td>
                                <td style={bodyStyle}>-Same format as skill1<br></br>
                                    - Cannot be equal to skill1
                                </td>
                                <td style={bodyStyle}>- Same format as skill1 and skill2<br></br>
                                    - Cannot be equal to skill1 and skill2</td>
                                <td style={bodyStyle}>- Non-negative number <br></br>
                                    - Between 0 and 168 (inclusive) <br></br>
                                    - Jumps of 0.5
                                </td>
                                <td style={bodyStyle}>
                                    - Same format as Min Hours <br></br>
                                    - Bigger than Min Hours
                                </td>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FirstTableInfo