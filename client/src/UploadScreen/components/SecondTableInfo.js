import React, { useRef, useLayoutEffect } from 'react'; // Add import for React
import '../css/scrollbar.css'

const SecondTableInfo = () => {
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
                                    <th class="cell100  first-column blue col-1" style={headerStyle} ref={ref}>Day</th>
                                    <th class="cell100  last-columns blue col-1" style={headerStyle}>Skill</th>
                                    <th class="cell100  last-columns blue col-1" style={headerStyle}>From</th>
                                    <th class="cell100  last-columns blue col-1" style={headerStyle}>Until</th>
                                    <th class="cell100  last-columns blue col-1" style={headerStyle}>Required Number Of Worker</th>
                                </tr>
                                <td ref={ref2} style={bodyStyle}>- Between Sunday to Saturday
                                </td>
                                <td style={bodyStyle}>- Use only letters, spaces, quotes, hyphens, pound signs, slashes, and dots. <br></br>
                                    - Keep it under 40 characters in length.</td>
                                <td style={bodyStyle}>- 00:00 to 23:00 <br></br>- Jumps of 30 minutes</td>
                                <td style={bodyStyle}>- 00:30 to 24:00 <br></br>- Jumps of 30 minutes</td>
                                <td style={bodyStyle}>- Positive Integer <br></br>- Smaller than the total number of workers</td>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SecondTableInfo