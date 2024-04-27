import React, { useEffect } from 'react';
import ShiftsRow from '../conponenets/ShiftsRow';
import { Modal, Button, Col } from 'react-bootstrap';
import { useState } from 'react';
//expecting json: [{"name":"name1", "shifts":[true, true, false, ...]}, {"name":"name2", "shifts":[true, true, false, ...]}, ....]
function TableAlgo2({ workersAndShifts }) {
    const [showModal, setShowModal] = useState(workersAndShifts.length == 0);

    useEffect(() =>{
        setShowModal(workersAndShifts.length == 0)
    }
    ,[workersAndShifts])
    console.log("workersAndShifts")
    console.log(workersAndShifts)
    return (
        <>
            <div className="container-table100">
                <div className="wrap-table100" style={{ opacity: workersAndShifts.length == 0 ? 0 : 1 }}>
                    <div className="ver1 m-b-110">
                        <div className="table100-body scrollbar" style={{position: 'fixed', maxHeight: "74vh", width: "98%", left: "1%", top: "16%"}}>
                            <table className="table table-hover table-striped" id="table">
                                <tbody>
                                    <tr className="row100 body first-row">
                                        <th className="cell100 first-column first-column-body blue static-position"></th>
                                        <th className="cell100 last-columns blue" style={{ textAlign: 'center', verticalAlign: 'middle' }}>00:00</th>
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
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title className="text-danger">No Results</Modal.Title>
                    <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body className="text-danger">No assigned workers at this day</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}



export default TableAlgo2;
