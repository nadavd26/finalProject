import React, { useState } from "react";
import Upload from "../TableScreen/images/uploadImage.webp";
import FileAdded from "./FileAdded";

const UploadFile = ({ file, onFileAdded, onFileDelete, user, fileNum, handleEdit }) => {
    // Destructure the file-related state

    const handleFileAdded = (event) => {
        onFileAdded(event.target.files[0]);
    };

    const handleFileDelete = () => {
        onFileDelete();
    };

    const table = user["table"+fileNum]
    return (
        <>
          {(table && table.length !== 0) || file ? (
            <FileAdded handleEdit={handleEdit} onFileAdded={onFileAdded}></FileAdded>
          ) : (
            <>
              <div className="container">
                <div className="d-flex justify-content-between mb-3 top-buttons">
                  <div className="col-4"></div>
                  <h3 className="justify-content-center col-4">Pick a CSV file to upload:</h3>
                  <div className="col-4"></div>
                </div>
              </div>
              <div className="container-fluid py-3">
                <div className="d-flex justify-content-between mb-3">
                  <div className="col-4"></div>
                    <div id="inform" className="container col-4">
                      <form id="file-upload-form" className="uploader">
                        <input id="file-upload" type="file" name="fileUpload" accept=".csv" onChange={handleFileAdded} />
                        <label style={{ height: "fit-content" }} htmlFor="file-upload" id="file-drag">
                          <img src={Upload} alt="Preview" className="upload-image"></img>
                          <div>Select a csv file</div>
                          <span id="file-upload-btn" className="btn btn-primary">
                            Select a file
                          </span>
                        </label>
                      </form>
                    </div>
                  <div className="container-fluid py-3">
                    <div className="col-4"></div>
                  </div>
                </div>
              </div>
              {/* {isFileAdded && 
              (
                <div className="d-flex justify-content-between mb-3 top-buttons">
                  <div className="col-4"></div>
                  <span className="badge badge-primary">
                    {file.name}
                    <button type="button" className="close" aria-label="Dismiss" onClick={handleFileDelete}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </span>
                  <div className="col-4"></div>
                </div>
              )
              } */}
            </>
          )}
        </>
      );
      
};
export default UploadFile;