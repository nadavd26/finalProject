import React, { useRef, useLayoutEffect } from 'react'; // Add import for React
import '../css/scrollbar.css'
const ThirdTableInfo = () => {
    const headerStyle = { backgroundColor: "rgb(60, 60, 60)", color: "white" };
    const bodyStyle = { backgroundColor: "white" };
    const ref = useRef();
    const ref2 = useRef();

    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.style.setProperty("border-left-width", "1px", "important");
        }
        if (ref2.current) {
            ref2.current.style.setProperty("border-left-width", "1px", "important");
        }
    }, []);

    return (
        <div className="container-table100 infoTable" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="wrap-table100 scrollbarr" style={{ overflow: 'auto' }}> {/* Add overflow style */}
                <div className="ver1 m-b-110">
                    <div className="table100-body">
                        <table className="table table-hover table-striped" id="table" style={{ maxWidth: '100%' }}>
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th className="cell100 first-column blue" style={headerStyle} ref={ref}>Skill</th>
                                    <th className="cell100 last-columns blue" style={headerStyle}>Day</th>
                                    <th className="cell100 last-columns blue" style={headerStyle}>From</th>
                                    <th className="cell100 last-columns blue" style={headerStyle}>Until</th>
                                    <th className="cell100 last-columns blue" style={headerStyle}>Cost</th>
                                </tr>
                                <tr>
                                    <td ref={ref2} style={bodyStyle}>- Use only letters, spaces, quotes, hyphens, pound signs, slashes, and dots. <br></br>
                                        - Keep it under 40 characters in length.</td>
                                    <td style={bodyStyle}>- Between Sunday to Saturday</td>
                                    <td style={bodyStyle}>- 00:00 to 23:00 <br></br>- Jumps of 30 minutes</td>
                                    <td style={bodyStyle}>- 00:30 to 24:00 <br></br>- Jumps of 30 minutes</td>
                                    <td style={bodyStyle}>- Positive integer smaller than 1000000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThirdTableInfo