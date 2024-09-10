import React from 'react';
import edit from './Images/edit.webp';
import upload from './Images/upload.png';

export default function FileAdded({ handleEdit, onFileAdded }) {
    const handleFileAdded = (event) => {
        onFileAdded(event.target.files[0]);
    };

    const contentStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center', // Adjusted alignItems
        width: '100%',
    };
    

    const actionStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const iconStyle = {
        width: '50px',  // Adjusted width
        height: 'auto',
        marginBottom: '10px',
    };

    return (
        <div>
            <div style={contentStyle}>               
                <div style={actionStyle}>
                    <div style={{}}><img src={upload} style={iconStyle} alt="Upload"/></div>
                    <label htmlFor="file-upload" className="btn btn-secondary" style={{}}>
                        Upload CSV File
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
                <div style={actionStyle}>
                    <div><img src={edit}  style={iconStyle} alt="Edit" /></div>
                    <button
                        className="btn btn-success"
                        onClick={handleEdit}
                        style={{}}
                    >
                        Edit Current File
                    </button>
                </div>
                <div style={actionStyle}>
                <button
                        className="btn btn-success"
                        style={{}}
                    >
                        Start From Scratch
                    </button>
                </div>
            </div>
        </div>
    );
}
