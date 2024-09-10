import { useState } from "react";
import up from '../Images/up.jpg';
import down from '../Images/down.jpg';
import equal from '../Images/equal.webp'
import { Modal, Button } from 'react-bootstrap';

const Kpi = ({ name, value, initialValue, description, maxWidth }) => {
    const [showModal, setShowModal] = useState(false);
    const imgType = value > initialValue ? up : value == initialValue ? equal : down;
    const modalTextType = value > initialValue ? "text-danger" : value == initialValue ? "text-warning": "text-success";
    const modalButtonType = value > initialValue ? "danger" : value == initialValue ? "warning": "success";

    const containerStyle = {
        border: '1px solid black',
        padding: '2px',
        fontSize: "3vh",
        backgroundColor: "white",
        maxWidth: maxWidth,  // Adjust the maximum width as needed
        display: 'inline-block',
        overflow: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'thin', // Width of the scrollbar
        scrollbarColor: 'rgba(0, 0, 0, 0.5) rgba(255, 255, 255, 0.5)', // Color of the scrollbar thumb and track
    };

    const buttonStyle = {
        padding: 0,
        margin: 0,
        border: "none",
        background: "none",
        outline: "none"
    };

    const imgStyle = {
        position: "relative",
        bottom: "0.5vh",
        height: "4vh",
        width: "4vh"
    };

    return (
        <>
            <span style={containerStyle}>
                {name}: {value}
                <button onClick={() => setShowModal(true)} style={buttonStyle}>
                    <img src={imgType} style={imgStyle} alt="Button Image" />
                </button>
                {initialValue === 0 ? (value === 0 ?
                    <span>0%</span> : <span>&infin;%</span>
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
                    <div>
                        <h5>
                            <span style={{ color: "black" }}>Description:<br /></span>
                            <span style={{ color: "gray" }}>{description}</span>
                        </h5>
                    </div>
                    <div><span style={{ color: "black" }}>Starting value:</span> {initialValue}</div>
                    <div><span style={{ color: "black" }}>Current value:</span> {value}</div>
                    <div><span style={{ color: "black" }}>Difference:</span> {value > initialValue ? "increased" : "reduced"} by&nbsp;
                        {initialValue === 0 ? (
                            value === 0 ?
                                <span>0%</span> : <span>&infin;%</span>
                        ) : (
                            <span>{(((Math.abs(value - initialValue)) / initialValue) * 100).toFixed(2)}%</span>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={modalButtonType} onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Kpi;
