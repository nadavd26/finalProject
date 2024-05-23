import React from 'react';
import edit from './Images/edit.webp';
import upload from './Images/upload.png';

export default function FileAdded({ handleEdit, onFileAdded }) {
    const handleFileAdded = (event) => {
        onFileAdded(event.target.files[0]);
    };

    const containerStyle = {
        display: 'flex',
        position: 'fixed',
        left: '35%',
        width: '40%',
        height: '27.5%',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '30vw',
        margin: 'auto',
    };

    const headerStyle = {
        marginBottom: '20px',
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
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h3>File Already Uploaded</h3>
            </div>
            <div style={contentStyle}>
                <div style={actionStyle}>
                    <div style={{position: 'fixed', left: '41%', top: '22.5%'}} ><img src={edit}  style={iconStyle} alt="Edit" /></div>
                    <button
                        className="btn btn-success"
                        onClick={handleEdit}
                        style={{position: 'fixed', top: '27.5%', left: '37.5%'}}
                    >
                        Edit Current File
                    </button>
                </div>
                <div style={actionStyle}>
                    <div style={{position: 'fixed', top: '20.5%', left: '55%'}}><img src={upload} style={iconStyle} alt="Upload"/></div>
                    <label htmlFor="file-upload" className="btn btn-secondary" style={{position: 'fixed', top: '27.5%', left: '52.5%'}}>
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
            </div>
        </div>
    );
}
