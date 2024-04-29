import { useState } from "react"
import up from '../Images/up.jpg'
import down from '../Images/down.jpg'
import { Modal, Button} from 'react-bootstrap';
const Kpi = ({name, value, initialValue}) => {
    const [showModal, setShowModal] = useState(false)
    const imgType = value >= initialValue ? up : down
    const modalTextType = value >= initialValue ? "text-success" : "text-danger"
    const modalButtonType = value >= initialValue ? "success" : "danger"
    return (
        <><span style={{ border: '1px solid black', padding: '2px', fontSize: "3vh", backgroundColor: "white" }}>{name}: {value}
            <button onClick={() => setShowModal(true)} style={{ padding: 0, margin: 0, border: "none", background: "none", outline: "none" }}>
                <img src={imgType} style={{ position: "relative", bottom: "0.5vh", height: "4vh", width: "4vh" }} alt="Button Image" />
            </button>
            {Math.abs(value - initialValue)}
        </span>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title className={modalTextType}>{name} info</Modal.Title>
                    <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body className={modalTextType}>
                    <div><span style={{ color: "black" }}>starting value:</span> {initialValue}</div>
                    <div><span style={{ color: "black" }}>current value:</span> {value}</div>
                    <div><span style={{ color: "black" }}>difference:</span> {value >= initialValue ? "increased" : "reduced"} by {Math.abs(value - initialValue)}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={modalButtonType} onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Kpi