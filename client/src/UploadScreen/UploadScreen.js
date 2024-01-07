import React, { useContext, useState } from "react";
import './UploadScreen.css'
import UploadFile from "./UploadFile";
import { useNavigate } from 'react-router-dom'
import { useEffect } from "react";
import EditInput from "../EditInputScreen/EditInput";

function UploadScreen({user, setUser}) {
  const [selectedButton, setSelectedButton] = useState("FirstFileButton");
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const [currentFile, setCurrentFile] = useState(null)
  const [editInfo, setEditInfo] = useState({inEdit : false, errorMsg : ""})
  const navigate = useNavigate();

  // console.log("upload screen user: "  + JSON.stringify(user) + "token: " + user.token)
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
    setEditInfo({inEdit : true, errorMsg : ""})
    setCurrentFile(file)
  };

  const handleFileDelete = (buttonId) => {
  };

  const handleSubmit = () => {
    var flag = true
    for (let i = 1; i <=3; i++) {
      if (!user["table" + i] || user["table" + i] == []) {
        flag = false
      }
    }
    if (flag) {
      setShowSubmitAlert(true);
      setTimeout(() => {
        setShowSubmitAlert(false);
      }, 2500);
    } else {
      navigate("/table")
    }
  }

  const handleEdit = () => {
    setEditInfo({inEdit : true, errorMsg : ""})
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
            file={currentFile}
            onFileAdded={(file) => handleFileAdded("FirstFileButton", file)}
            onFileDelete={() => handleFileDelete("FirstFileButton")}
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
            onFileDelete={() => handleFileDelete("SecondFileButton")}
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
            onFileDelete={() => handleFileDelete("ThirdFileButton")}
            user={user}
            fileNum={3}
            handleEdit={handleEdit}
          />
        )}
        <div className="btn-container">
          <div className="d-flex justify-content-between mb-3 top-buttons">
            <div className="col-4"></div>
            <button className="btn btn-success col-4" onClick={handleSubmit}>Generate Results</button>
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

      </div>
    ) : <EditInput file={currentFile} numOfFile={getFileNumber()} setEditInfo={setEditInfo} user={user} setUser={setUser} setCurrentFile={setCurrentFile}/>
  );
}

export default UploadScreen;
