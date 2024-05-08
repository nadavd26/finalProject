import { useState } from "react"
import up from '../Images/up.jpg'
import down from '../Images/down.jpg'
import { Modal, Button } from 'react-bootstrap';
const Kpi = ({ name, value, initialValue, description }) => {
    const [showModal, setShowModal] = useState(false)
    const imgType = value > initialValue ? up : down
    const modalTextType = value > initialValue ?  "text-danger" : "text-success"
    const modalButtonType = value > initialValue ?    "danger" :"success"
    return (
        <><span style={{ border: '1px solid black', padding: '2px', fontSize: "3vh", backgroundColor: "white" }}>{name}: {value}
            <button onClick={() => setShowModal(true)} style={{ padding: 0, margin: 0, border: "none", background: "none", outline: "none" }}>
                <img src={imgType} style={{ position: "relative", bottom: "0.5vh", height: "4vh", width: "4vh" }} alt="Button Image" />
            </button>
            {initialValue === 0 ? ( value == 0 ?
                <span>0%</span>  : <span>&infin;%</span>
            ) : ( 
                <span>{(((Math.abs(value - initialValue)) / initialValue) * 100).toFixed(2)}%</span>
            )}
        </span>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title className={modalTextType}>{name} info</Modal.Title>
                    <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body className={modalTextType}>
                <div><h5><span style={{ color: "black" }}>description: <br></br></span><span style={{ color: "gray" }}>{description}</span></h5></div>
                    <div><span style={{ color: "black" }}>starting value:</span> {initialValue}</div>
                    <div><span style={{ color: "black" }}>current value:</span> {value}</div>
                    <div><span style={{ color: "black" }}>difference:</span> {value > initialValue ? "increased" : "reduced"} by&nbsp;
                        {initialValue === 0 ? (
                            value == 0 ?
                            <span>0%</span>  : <span>&infin;%</span>
                        ) : (
                            <span>{(((Math.abs(value - initialValue)) / initialValue) * 100).toFixed(2)}%</span>
                        )}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={modalButtonType} onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Kpi