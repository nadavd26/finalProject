import React, { useContext, useRef, useLayoutEffect, useState } from "react";
import './UploadScreen.css'
import UploadFile from "./UploadFile";
import { useNavigate } from 'react-router-dom'
import { useEffect } from "react";
import EditInput from "../EditInputScreen/EditInput";
import { Modal, Button, ModalBody } from 'react-bootstrap';
import { validateInputTables } from "../api/InputTableApi";
import { ExclamationTriangleFill, FileX } from 'react-bootstrap-icons';
import ThirdTableInfo from "./components/ThirdTableInfo";
import FirstTableInfo from "./components/FirstTableInfo";
import SecondTableInfo from "./components/SecondTableInfo";
import Logout from "../LoginScreen/components/logout";


function UploadScreen({ user, setUser }) {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [validationWarning, setValidationWarning] = useState("")
  const [table2Table3Changed, setTable2Table3Changed] = useState(false)
  const [selectedButton, setSelectedButton] = useState("FirstFileButton");
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const [currentFile, setCurrentFile] = useState(null)
  const [scratch, setScratch] = useState(false)

  const [editInfo, setEditInfo] = useState({ inEdit: false, errorMsg: "" })
  const navigate = useNavigate();
  const handleCloseGenerateModal = () => {
    setShowGenerateModal(false);
  };
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
      setTable2Table3Changed(res.changed)


      if (res.type != "success") {
        if (res.type == "warning") {
          setValidationWarning(res.msg)
          setShowWarningModal(true)
        } else {
          setValidationError(res.msg)
          setShowErrorModal(true)
        }
      } else {


        generate(res.changed)
      }
    }
  }

  const generate = (changed) => {
    if (changed) {
      generateAgain()
    } else {
      setShowGenerateModal(true);
    }
  }

  const generateAnyway = () => {
    setShowWarningModal(false)
    generate(table2Table3Changed)
  }

  const handleEdit = () => {
    setScratch(false)
    setEditInfo({ inEdit: true, errorMsg: "" })
  }

  const handleScratch = () => {
    setScratch(true)
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
    const uploaded = buttonId == "FirstFileButton" ? user.table1 && user.table1.length > 0 : buttonId == "SecondFileButton" ? user.table2 && user.table2.length > 0 : user.table3 && user.table3.length > 0

    if (uploaded) {
      return selectedButton == buttonId ? "btn shadow-none uploaded-current-button col-2" : "btn shadow-none uploaded-button col-2"
    }

    return selectedButton == buttonId ? "btn shadow-none not-uploaded-current-button col-2" : "btn shadow-none not-uploaded-button col-2"
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


  const handleLogout = () => {
    // Clear the user context
    setUser(null);

    // Navigate to login page
    navigate("/login");

    // Sign out the user from Google
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2) {
      auth2.signOut().then(() => {

        auth2.disconnect();
      });
    }
  };



  const tableInfos = () => {
    return (<div>
      {selectedButton == "FirstFileButton" ? <FirstTableInfo></FirstTableInfo> : selectedButton == "SecondFileButton" ? <SecondTableInfo></SecondTableInfo> : <ThirdTableInfo></ThirdTableInfo>}
    </div>)
  }



  return (
    !editInfo.inEdit ? (
      <div id="upload_screen" className="flex-column justify-content-center">
        <div style={{ position: "relative", left: "1%", top: "1%" }}>
          <Logout onLogout={handleLogout}></Logout>
        </div>
        <div className="container-fluid py-3">
          <div className="d-flex justify-content-between mb-3 top-buttons">
            <div className="col-1"></div>
            <button
              id="FirstFileButton"
              className={buttonStyles("FirstFileButton")}
              onClick={() => handleButtonClick("FirstFileButton")}
            >
              Worker Info Table
            </button>
            <button
              id="SecondFileButton"
              className={buttonStyles("SecondFileButton")}
              onClick={() => handleButtonClick("SecondFileButton")}
            >
              Requirements Table
            </button>
            <button
              id="ThirdFileButton"
              className={buttonStyles("ThirdFileButton")}
              onClick={() => handleButtonClick("ThirdFileButton")}
            >
              Shifts Info Table
            </button>
            <div className="col-1"></div>
          </div>
        </div>


        <div id="infoTables" style={{ position: "relative", left: "2.5vw", width: "95vw" }}>
          <h3 style={{ marginBottom: "20px", display: 'flex', justifyContent: 'center' }}>{selectedButton == "FirstFileButton" ? "Worker Info Table" : selectedButton == "SecondFileButton" ? "Requirements Table" : "Shifts Info Table"}</h3>
          <div style={{ marginBottom: "10px" }}>{tableInfos()}</div>
          {selectedButton === "FirstFileButton" && (
            <UploadFile
              id="uploadFile1"
              file={currentFile}
              onFileAdded={(file) => handleFileAdded("FirstFileButton", file)}
              user={user}
              fileNum={1}
              handleEdit={handleEdit}
              handleScratch={handleScratch}
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
              handleScratch={handleScratch}
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
              handleScratch={handleScratch}
            />
          )}

          <div className="btn-container" style={{ position: "relative" }}>
            <div className="d-flex justify-content-between mb-3 top-buttons">
              <div className="col-5"></div>
              <button className="btn btn-success col-2" onClick={handleSubmit} style={{ marginTop: "40px", borderRadius: "15px" }}>
                Generate Results
              </button>
              <div className="col-5"></div>
            </div>

            {showSubmitAlert && (
              <div className="alert alert-danger col-4 text-center" role="alert" style={{
                position: "absolute",
                top: "35px", // Adjusted to cover the button more completely
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1, // Ensure the alert is on top
                height: "auto", // Ensure the alert height matches or exceeds the button height
                padding: "10px 0" // Add padding to make the alert visually comfortable
              }}>
                Can't Generate Results without all input files.
              </div>
            )}
          </div>


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

        <Modal show={showWarningModal} onHide={handleCloseWarningModal} centered>
          <Modal.Header style={{ backgroundColor: '#FCFFA5', paddingRight: '1rem' }}>
            <Modal.Title className="text-center w-100" style={{ color: '#7F8307' }}>
              <ExclamationTriangleFill style={{ marginRight: '10px', color: '#7F8307' }} /> Warning
            </Modal.Title>
            <button type="button" className="close" onClick={() => setShowWarningModal(false)} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#FCFFA5', color: '#7F8307', whiteSpace: 'pre-wrap' }}>
            {validationWarning}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#FCFFA5', display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleCloseWarningModal} className="mr-auto" style={{ backgroundColor: '#7F8307', borderColor: '#7F8307' }}>
              Ok
            </Button>
            <Button variant="danger" onClick={generateAnyway} style={{ backgroundColor: '#7F8307', borderColor: '#7F8307' }}>
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
    ) : <EditInput file={currentFile} numOfFile={getFileNumber()} setEditInfo={setEditInfo} user={user} setUser={setUser} setCurrentFile={setCurrentFile} scratch={scratch} />
  );
}

export default UploadScreen;
