import React from 'react';
import ShiftsRow from './ShiftsRow';

//expecting json: [{"name":"name1", "shifts":[true, true, false, ...]}, {"name":"name2", "shifts":[true, true, false, ...]}, ....]
function Table({ workersAndShifts }) {
    return (
        <div className="container-table100">
            <div className="wrap-table100">
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped">
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th className="cell100 first-column first-column-body blue static-position"></th>
                                    <th className="cell100 last-columns blue">7:00 - 7:30</th>
                                    <th className="cell100 last-columns blue">7:30 - 8:00</th>
                                    <th className="cell100 last-columns blue">8:00 - 8:30</th>
                                    <th className="cell100 last-columns blue">8:30 - 9:00</th>
                                    <th className="cell100 last-columns blue">9:00 - 9:30</th>
                                    <th className="cell100 last-columns blue">9:30 - 10:00</th>
                                    <th className="cell100 last-columns blue">10:00 - 10:30</th>
                                    <th className="cell100 last-columns blue">10:30 - 11:00</th>
                                    <th className="cell100 last-columns blue">11:00 - 11:30</th>
                                    <th className="cell100 last-columns blue">11:30 - 12:00</th>
                                    <th className="cell100 last-columns blue">12:00 - 12:30</th>
                                    <th className="cell100 last-columns blue">12:30 - 13:00</th>
                                    <th className="cell100 last-columns blue">13:00 - 13:30</th>
                                    <th className="cell100 last-columns blue">13:30 - 14:00</th>
                                    <th className="cell100 last-columns blue">14:00 - 14:30</th>
                                    <th className="cell100 last-columns blue">14:30 - 15:00</th>
                                    <th className="cell100 last-columns blue">15:00 - 15:30</th>
                                    <th className="cell100 last-columns blue">15:30 - 16:00</th>
                                    <th className="cell100 last-columns blue">16:00 - 16:30</th>
                                    <th className="cell100 last-columns blue">16:30 - 17:00</th>
                                    <th className="cell100 last-columns blue">17:00 - 17:30</th>
                                    <th className="cell100 last-columns blue">17:30 - 18:00</th>
                                    <th className="cell100 last-columns blue">18:00 - 18:30</th>
                                    <th className="cell100 last-columns blue">18:30 - 19:00</th>
                                    <th className="cell100 last-columns blue">19:00 - 19:30</th>
                                    <th className="cell100 last-columns blue">19:30 - 20:00</th>
                                    <th className="cell100 last-columns blue">20:00 - 20:30</th>
                                    <th className="cell100 last-columns blue">20:30 - 21:00</th>
                                    <th className="cell100 last-columns blue">21:00 - 21:30</th>
                                    <th className="cell100 last-columns blue">21:30 - 22:00</th>
                                    <th className="cell100 last-columns blue">22:00 - 22:30</th>
                                    <th className="cell100 last-columns blue">22:30 - 23:00</th>
                                    <th className="cell100 last-columns blue">23:00 - 23:30</th>
                                    <th className="cell100 last-columns blue">23:30 - 00:00</th>
                                    <th className="cell100 last-columns blue">00:00 - 00:00</th>
                                    <th className="cell100 last-columns blue">00:30 - 01:00</th>
                                    <th className="cell100 last-columns blue">01:00 - 00:00</th>
                                    <th className="cell100 last-columns blue">01:30 - 02:00</th>
                                    <th className="cell100 last-columns blue">02:00 - 02:30</th>
                                    <th className="cell100 last-columns blue">02:30 - 03:00</th>
                                    <th className="cell100 last-columns blue">03:00 - 03:30</th>
                                    <th className="cell100 last-columns blue">03:30 - 04:00</th>
                                    <th className="cell100 last-columns blue">04:00 - 04:30</th>
                                    <th className="cell100 last-columns blue">04:30 - 05:00</th>
                                    <th className="cell100 last-columns blue">05:00 - 05:30</th>
                                    <th className="cell100 last-columns blue">05:30 - 06:00</th>
                                    <th className="cell100 last-columns blue">06:00 - 06:30</th>
                                    <th className="cell100 last-columns blue">06:30 - 07:00</th>
                                </tr>
                                {workersAndShifts.map((workerData, index) => (
                                    <ShiftsRow key={index} {...workerData} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;
