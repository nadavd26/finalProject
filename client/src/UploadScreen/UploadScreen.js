import React, { useState } from "react";
import './UploadScreen.css'
import UploadFile from "./UploadFile";
import { useNavigate } from 'react-router-dom'
import { useEffect } from "react";
import EditInput from "../EditInputScreen/EditInput";

function UploadScreen() {
  const [selectedButton, setSelectedButton] = useState("FirstFileButton");
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const [fileStates, setFileStates] = useState({
    FirstFileButton: { file: null, isFileAdded: false },
    SecondFileButton: { file: null, isFileAdded: false },
    ThirdFileButton: { file: null, isFileAdded: false },
  });
  const [editInfo, setEditInfo] = useState({inEdit : false, errorMsg : ""})
  const navigate = useNavigate();

  useEffect(() => {
    if (editInfo.errorMsg !== "") {
      const modal = new window.bootstrap.Modal(document.getElementById('UploadScreenErrorModal'));
      modal.show();
    }
  }, [editInfo.errorMsg]);


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

  const handleEdit = () => {
    setEditInfo({inEdit : true, errorMsg : ""})
  }

  function getFileAndNumber() {
    var numOfFile = 1
    var file = null
    if (selectedButton === "FirstFileButton") {
      file = fileStates.FirstFileButton.file
    }
    if (selectedButton === "SecondFileButton") {
      numOfFile = 2
      file = fileStates.SecondFileButton.file
    }
    if (selectedButton === "ThirdFileButton") {
      file = fileStates.ThirdFileButton.file
      numOfFile = 3
    }

    return { file: file, numOfFile: numOfFile }
  }


  const buttonStyles = (buttonId) => {
    return selectedButton === buttonId
      ? "btn btn-primary col-2"
      : "btn btn-secondary col-2";
  };

  const handleErrorModalClose = () => {
    setEditInfo({inEdit : false, errorMsg : ""})
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
            <div className="col-3"></div>
            <button className="btn btn-success col-3" onClick={handleSubmit}>Upload File</button>
            <button className="btn btn-secondary col-3" data-toggle="modal" data-target="#UploadScreenErrorModal" onClick={handleEdit}>Edit</button>
            <div className="col-3"></div>
          </div>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <div className="col-4"></div>
          {showSubmitAlert && <div className="alert alert-danger col-4" role="alert">
            Can't upload without all input files.
          </div>}
          <div className="col-4"></div>
        </div>

        {editInfo.errorMsg != "" && <div class="modal fade show" id="UploadScreenErrorModal" tabindex="-1" role="dialog" aria-labelledby="errorModal" aria-hidden="true" onHide={handleErrorModalClose}>
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content modal-danger"> {/* Add custom class modal-danger */}
              <div class="modal-header">
                <h5 class="modal-title text-danger">Cannot Edit File</h5>
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

      </div>
    ) : <EditInput file={getFileAndNumber().file} numOfFile={getFileAndNumber().numOfFile} setEditInfo={setEditInfo} />
  );
}

export default UploadScreen;
