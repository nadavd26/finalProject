import React from 'react';
import ShiftsRow from '../conponenets/ShiftsRow';

//expecting json: [{"name":"name1", "shifts":[true, true, false, ...]}, {"name":"name2", "shifts":[true, true, false, ...]}, ....]
function TableAlgo2({ workersAndShifts }) {
    return (
        <div className="container-table100">
            <div className="wrap-table100">
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th className="cell100 first-column first-column-body blue static-position"></th>
                                    <th className="cell100 last-columns blue">00:00</th>
                                    <th className="cell100 last-columns blue">00:30</th>
                                    <th className="cell100 last-columns blue">01:00</th>
                                    <th className="cell100 last-columns blue">01:30</th>
                                    <th className="cell100 last-columns blue">02:00</th>
                                    <th className="cell100 last-columns blue">02:30</th>
                                    <th className="cell100 last-columns blue">03:00</th>
                                    <th className="cell100 last-columns blue">03:30</th>
                                    <th className="cell100 last-columns blue">04:00</th>
                                    <th className="cell100 last-columns blue">04:30</th>
                                    <th className="cell100 last-columns blue">05:00</th>
                                    <th className="cell100 last-columns blue">05:30</th>
                                    <th className="cell100 last-columns blue">06:00</th>
                                    <th className="cell100 last-columns blue">06:30</th>
                                    <th className="cell100 last-columns blue">7:00</th>
                                    <th className="cell100 last-columns blue">7:30</th>
                                    <th className="cell100 last-columns blue">8:00</th>
                                    <th className="cell100 last-columns blue">8:30</th>
                                    <th className="cell100 last-columns blue">9:00</th>
                                    <th className="cell100 last-columns blue">9:30</th>
                                    <th className="cell100 last-columns blue">10:00</th>
                                    <th className="cell100 last-columns blue">10:30</th>
                                    <th className="cell100 last-columns blue">11:00</th>
                                    <th className="cell100 last-columns blue">11:30</th>
                                    <th className="cell100 last-columns blue">12:00</th>
                                    <th className="cell100 last-columns blue">12:30</th>
                                    <th className="cell100 last-columns blue">13:00</th>
                                    <th className="cell100 last-columns blue">13:30</th>
                                    <th className="cell100 last-columns blue">14:00</th>
                                    <th className="cell100 last-columns blue">14:30</th>
                                    <th className="cell100 last-columns blue">15:00</th>
                                    <th className="cell100 last-columns blue">15:30</th>
                                    <th className="cell100 last-columns blue">16:00</th>
                                    <th className="cell100 last-columns blue">16:30</th>
                                    <th className="cell100 last-columns blue">17:00</th>
                                    <th className="cell100 last-columns blue">17:30</th>
                                    <th className="cell100 last-columns blue">18:00</th>
                                    <th className="cell100 last-columns blue">18:30</th>
                                    <th className="cell100 last-columns blue">19:00</th>
                                    <th className="cell100 last-columns blue">19:30</th>
                                    <th className="cell100 last-columns blue">20:00</th>
                                    <th className="cell100 last-columns blue">20:30</th>
                                    <th className="cell100 last-columns blue">21:00</th>
                                    <th className="cell100 last-columns blue">21:30</th>
                                    <th className="cell100 last-columns blue">22:00</th>
                                    <th className="cell100 last-columns blue">22:30</th>
                                    <th className="cell100 last-columns blue">23:00</th>
                                    <th className="cell100 last-columns blue">23:30</th>
                                </tr>
                                {workersAndShifts.map((workerData, index) => (
                                    <ShiftsRow
                                        key={index}
                                        {...workerData}
                                        defaultColor={index % 2 === 0 ? 'white' : 'gray'}
                                        optionalColor={index % 2 === 0 ? 'green' : 'dark-green'}
                                    />
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default TableAlgo2;
