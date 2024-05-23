import React, { useContext, useState } from "react";
import './UploadScreen.css'
import UploadFile from "./UploadFile";
import { useNavigate } from 'react-router-dom'
import { useEffect } from "react";
import EditInput from "../EditInputScreen/EditInput";
import { Modal, Button, ModalBody } from 'react-bootstrap';
import { validateInputTables } from "../api/InputTableApi";
import { ExclamationTriangleFill, FileX } from 'react-bootstrap-icons';



function UploadScreen({ user, setUser }) {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [validationWarning, setValidationWarning] = useState("")
  const [selectedButton, setSelectedButton] = useState("FirstFileButton");
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const [currentFile, setCurrentFile] = useState(null)
  const [editInfo, setEditInfo] = useState({ inEdit: false, errorMsg: "" })
  const navigate = useNavigate();
  const handleCloseGenerateModal = () => {
    setShowGenerateModal(false);
  };
  // console.log("upload screen user: "  + JSON.stringify(user) + "token: " + user.token)
  useEffect(() => {
    if (editInfo.errorMsg !== "") {
      const modal = new window.bootstrap.Modal(document.getElementById('UploadScreenErrorModal'));
      modal.show();
    }
  }, [editInfo.errorMsg]);

  useEffect(() => {
    const userInfo = user
    userInfo["table1Changed"] = false
    userInfo["table2Changed"] = false
    userInfo["table3Changed"] = false
    userInfo["tableAlgo1Changed"] = false
    setUser(userInfo)
  }, [])

  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  const handleFileAdded = (buttonId, file) => {
    setEditInfo({ inEdit: true, errorMsg: "" })
    setCurrentFile(file)
  };

  const handleCloseWarningModal = () => {
    setShowWarningModal(false)
  }

  const handleSubmit = async () => {
    var flag = false
    for (let i = 1; i <= 3; i++) {
      if (!user["table" + i] || user["table" + i] == []) {
        flag = true
      }
    }
    if (flag) {
      setShowSubmitAlert(true);
      setTimeout(() => {
        setShowSubmitAlert(false);
      }, 2500);
    } else {
      const res = await validateInputTables(user.token)
      console.log("res")
      console.log(res)
      if (res != "") {
        if (res.type == "warning") {
          setValidationWarning(res.msg)
          setShowWarningModal(true)
        } else {
          setValidationError(res.msg)
          setShowErrorModal(true)
        }
      } else {
        generate()
      }
    }
  }

  const generate = () => {
    if (user.table2Changed || user.table3Changed) {
      generateAgain()
    } else {
      setShowGenerateModal(true);
    }
  }

  const generateAnyway = () => {
    setShowWarningModal(false)
    generate()
  }

  const handleEdit = () => {
    setEditInfo({ inEdit: true, errorMsg: "" })
  }

  function getFileNumber() {
    var numOfFile = 1
    if (selectedButton === "SecondFileButton") {
      numOfFile = 2
    }
    if (selectedButton === "ThirdFileButton") {
      numOfFile = 3
    }

    return numOfFile
  }


  const buttonStyles = (buttonId) => {
    return selectedButton === buttonId
      ? "btn btn-primary col-2"
      : "btn btn-secondary col-2";
  };

  const handleErrorModalClose = () => {
    setEditInfo({ inEdit: false, errorMsg: "" })
  }

  const generateAgain = () => {
    var newUser = user
    newUser.tableAlgo1FromDb = false
    newUser.tableAlgo1Changed = true
    setUser(newUser)
    navigate("/table")
  }

  const proceedCurrent = () => {
    var newUser = user
    newUser.tableAlgo1FromDb = true
    setUser(newUser)
    navigate("/table")
  }
  function renderStringWithLineBreaks(inputString) {
    const lines = inputString.split('\n');
    return lines.map((line, index) => <div key={index}>{line}</div>);
  }

  return (
    !editInfo.inEdit ? (
      <div id="upload_screen">
        <div className="container-fluid py-3">
          <div className="d-flex justify-content-between mb-3 top-buttons">
            <div className="col-3"></div>
            <button
              id="FirstFileButton"
              className={buttonStyles("FirstFileButton")}
              onClick={() => handleButtonClick("FirstFileButton")}
            >
              First file
            </button>
            <button
              id="SecondFileButton"
              className={buttonStyles("SecondFileButton")}
              onClick={() => handleButtonClick("SecondFileButton")}
            >
              Second File
            </button>
            <button
              id="ThirdFileButton"
              className={buttonStyles("ThirdFileButton")}
              onClick={() => handleButtonClick("ThirdFileButton")}
            >
              Third File
            </button>
            <div className="col-3"></div>
          </div>
        </div>
        {selectedButton === "FirstFileButton" && (
          <UploadFile
            id="uploadFile1"
            file={currentFile}
            onFileAdded={(file) => handleFileAdded("FirstFileButton", file)}
            user={user}
            fileNum={1}
            handleEdit={handleEdit}
          />
        )}
        {selectedButton === "SecondFileButton" && (
          <UploadFile
            id="uploadFile2"
            file={currentFile}
            onFileAdded={(file) => handleFileAdded("SecondFileButton", file)}
            user={user}
            fileNum={2}
            handleEdit={handleEdit}
          />
        )}
        {selectedButton === "ThirdFileButton" && (
          <UploadFile
            id="uploadFile3"
            file={currentFile}
            onFileAdded={(file) => handleFileAdded("ThirdFileButton", file)}
            user={user}
            fileNum={3}
            handleEdit={handleEdit}
          />
        )}
        <div className="btn-container">
          <div className="d-flex justify-content-between mb-3 top-buttons">
            <div className="col-4"></div>
            <button className="btn btn-success col-4" style={{position: 'fixed', top: '60%', width: '30%', left: '35%'}} onClick={handleSubmit}>Generate Results</button>
            {/* <button className="btn btn-secondary col-3" data-toggle="modal" data-target="#UploadScreenErrorModal" onClick={handleEdit}>Upload/Edit File</button> */}
            <div className="col-4"></div>
          </div>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <div className="col-4"></div>
          {showSubmitAlert && <div className="alert alert-danger col-4" role="alert">
            Can't Generate Results without all input files.
          </div>}
          <div className="col-4"></div>
        </div>

        {editInfo.errorMsg != "" && <div class="modal fade show" id="UploadScreenErrorModal" tabindex="-1" role="dialog" aria-labelledby="errorModal" aria-hidden="true" onHide={handleErrorModalClose}>
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content modal-danger"> {/* Add custom class modal-danger */}
              <div class="modal-header">
                <h5 class="modal-title text-danger">Cannot Upload File</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body text-danger"> {/* Add text-danger for red text */}
                {editInfo.errorMsg}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Go Back</button>
              </div>
            </div>
          </div>
        </div>}
        <Modal show={showGenerateModal} onHide={handleCloseGenerateModal} centered>
          <Modal.Header style={{ paddingRight: '1rem' }}>
            <Modal.Title className="text-center w-100">Which Results To Choose?</Modal.Title>
            <button type="button" className="close" onClick={() => setShowGenerateModal(false)} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="secondary" onClick={generateAgain} className="mr-auto">
              Generate results again
            </Button>
            <Button variant="success" onClick={proceedCurrent}>
              Proceed with current results
            </Button>
          </Modal.Footer>
        </Modal>

        {/* <Modal show={showWarningModal} onHide={handleCloseWarningModal} centered>
          <Modal.Header style={{ backgroundColor: '#f8d7da', paddingRight: '1rem' }}>
            <Modal.Title className="text-center w-100" style={{ color: '#721c24' }}>
              <ExclamationTriangleFill style={{ marginRight: '10px' }} /> Warning
            </Modal.Title>
            <button type="button" className="close" onClick={() => setShowWarningModal(false)} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#f8d7da', color: '#721c24', whiteSpace: 'pre-wrap' }}>
            {validationWarning}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#f8d7da', display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="danger" onClick={handleCloseWarningModal} className="mr-auto">
              Ok
            </Button>
            <Button variant="danger" onClick={generateAnyway}>
              Generate Anyway
            </Button>
          </Modal.Footer>
        </Modal> */}

        <Modal show={showWarningModal} onHide={handleCloseWarningModal} centered>
          <Modal.Header style={{ backgroundColor: '#FCFFA5', paddingRight: '1rem' }}>
            <Modal.Title className="text-center w-100" style={{ color: '#7F8307' }}>
              <ExclamationTriangleFill style={{ marginRight: '10px', color: '#7F8307' }} /> Warning
            </Modal.Title>
            <button type="button" className="close" onClick={() => setShowWarningModal(false)} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#FCFFA5', color: '#7F8307', whiteSpace: 'pre-wrap'}}>
            {validationWarning}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#FCFFA5', display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleCloseWarningModal} className="mr-auto" style={{backgroundColor: '#7F8307', borderColor: '#7F8307'}}>
              Ok
            </Button>
            <Button variant="danger" onClick={generateAnyway} style={{backgroundColor: '#7F8307', borderColor: '#7F8307'}}>
              Generate Anyway
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
          <Modal.Header style={{ backgroundColor: '#f8d7da', paddingRight: '1rem' }}>
            <Modal.Title className="text-center w-100" style={{ color: '#721c24' }}>
              <ExclamationTriangleFill style={{ marginRight: '10px' }} /> Error
            </Modal.Title>
            <button type="button" className="close" onClick={() => setShowErrorModal(false)} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#f8d7da', color: '#721c24', whiteSpace: 'pre-wrap' }}>
            {validationError}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#f8d7da', display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="danger" onClick={() => setShowErrorModal(false)} className="mr-auto">
              Ok
            </Button>
          </Modal.Footer>
        </Modal>



      </div>
    ) : <EditInput file={currentFile} numOfFile={getFileNumber()} setEditInfo={setEditInfo} user={user} setUser={setUser} setCurrentFile={setCurrentFile} />
  );
}

export default UploadScreen;
