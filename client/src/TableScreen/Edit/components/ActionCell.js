import React from 'react';
import info from '../Images/info.png';

export default function ActionCell({ getLineInfo, rowIndex, color }) {
    const buttonStyle = {
        visibility: color === 'white' ? 'hidden' : 'visible'
    };

    return (
        <td id="deleteRow" className='cell100 first-column static-position'>
            <h6>{rowIndex + 1}</h6>
            <button
                className="border-0 p-0 no-outline actionButton"
                onClick={() => getLineInfo(rowIndex)}
                style={buttonStyle} // Apply button style dynamically
            >
                <img src={info} alt="Info Icon" className="img-fluid actionImage" />
            </button>
        </td>
    );
}
