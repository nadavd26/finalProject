import React, { useState } from "react";
import './UploadScreen.css'
import UploadFile from "./UploadFile";
import { useNavigate } from 'react-router-dom'

function UploadScreen() {
  const [selectedButton, setSelectedButton] = useState("FirstFileButton");
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const [fileStates, setFileStates] = useState({
    FirstFileButton: { file: null, isFileAdded: false },
    SecondFileButton: { file: null, isFileAdded: false },
    ThirdFileButton: { file: null, isFileAdded: false },
  });
  const navigate = useNavigate();


  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  const handleFileAdded = (buttonId, file) => {
    setShowSubmitAlert(false);
    setFileStates((prevFileStates) => ({
      ...prevFileStates,
      [buttonId]: { file, isFileAdded: true },
    }));
  };

  const handleFileDelete = (buttonId) => {
    setFileStates((prevFileStates) => ({
      ...prevFileStates,
      [buttonId]: { file: null, isFileAdded: false },
    }));
  };

  const handleSubmit = () => {
    if (!(fileStates.FirstFileButton.isFileAdded && fileStates.SecondFileButton.isFileAdded && fileStates.ThirdFileButton.isFileAdded)) {
      setShowSubmitAlert(true);
    } else {
      navigate("/table")
    }
  }


  const buttonStyles = (buttonId) => {
    return selectedButton === buttonId
      ? "btn btn-primary col-2"
      : "btn btn-secondary col-2";
  };
  return (
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
          fileState={fileStates.FirstFileButton}
          onFileAdded={(file) => handleFileAdded("FirstFileButton", file)}
          onFileDelete={() => handleFileDelete("FirstFileButton")}
        />
      )}
      {selectedButton === "SecondFileButton" && (
        <UploadFile
          id="uploadFile2"
          fileState={fileStates.SecondFileButton}
          onFileAdded={(file) => handleFileAdded("SecondFileButton", file)}
          onFileDelete={() => handleFileDelete("SecondFileButton")}
        />
      )}
      {selectedButton === "ThirdFileButton" && (
        <UploadFile
          id="uploadFile3"
          fileState={fileStates.ThirdFileButton}
          onFileAdded={(file) => handleFileAdded("ThirdFileButton", file)}
          onFileDelete={() => handleFileDelete("ThirdFileButton")}
        />
      )}
      <div className="btn-container">
        <div className="d-flex justify-content-between mb-3 top-buttons">
          <div className="col-4"></div>
          <button className="btn btn-success col-4" onClick={handleSubmit}>Upload File</button>
          <div className="col-4"></div>
        </div>
      </div>
      <div className="d-flex justify-content-between mb-3">
        <div className="col-4"></div>
        {showSubmitAlert && <div className="alert alert-danger col-4" role="alert">
          Can't upload without all input files.
        </div>}
        <div className="col-4"></div>
      </div>
    </div>
  );
}

export default UploadScreen;
