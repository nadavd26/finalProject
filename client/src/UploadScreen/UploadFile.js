import React from "react";
import edit from './Images/edit.webp';
import upload from './Images/upload.png';
import scratch from './Images/scratch.png';
import './css/UploadFile.css';

const UploadFile = ({ file, onFileAdded, user, fileNum, handleEdit, handleScratch }) => {
  const handleFileAdded = (event) => {
    onFileAdded(event.target.files[0]);
  };

  const table = user["table" + fileNum];

  const actionContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  };

  const editStyle = {
    display: (table && table.length !== 0) || file ? 'flex' : 'none',
  };

  const iconStyle = {
    width: '30px',
    height: '30px',
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div style={actionContainerStyle}>
        <div style={{width: "50px", height: "50px"}}>
          <label htmlFor="file-upload" className="circle-btn" title="Upload CSV File">
            <img src={upload} style={iconStyle} alt="Upload" />
            <input
              id="file-upload"
              type="file"
              name="fileUpload"
              accept=".csv"
              onChange={handleFileAdded}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <div style={{...editStyle, width: "50px", height: "50px"}}>
          <button
            className="circle-btn"
            onClick={handleEdit}
            title="Edit Current File"
          >
            <img src={edit} style={{width: "50px", height: "30px"}} alt="Edit" />
          </button>
        </div>
        <div style={{width: "50px", height: "50px"}}>
          <button
            className="circle-btn"
            onClick={handleScratch}
            title="Start From Scratch"
          >
            <img src={scratch} style={iconStyle} alt="Start From Scratch" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;
