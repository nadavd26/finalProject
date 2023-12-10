//shifts = [true, false, true, ....] when every entry represent if the worker has a shift and the parallel time interval
import React from 'react';

function ShiftsRow({ name, shifts, defaultColor, optionalColor }) {
    return (
        <tr className="row100 body last-rows">
            <td className={`cell100 first-column static-position ${defaultColor}`}>{name}</td>
            {shifts.map((shift, index) => (
                <td key={index} className={`cell100 last-columns ${shift ? optionalColor : defaultColor}`}></td>
            ))}
        </tr>
    );
}

export default ShiftsRow;
