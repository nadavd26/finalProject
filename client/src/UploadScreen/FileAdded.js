import Upload from "../TableScreen/images/uploadImage.webp";
export default function FileAdded({ handleEdit, onFileAdded }) {
    const handleFileAdded = (event) => {
        onFileAdded(event.target.files[0]);
    };

    return <><div className="container">
        <div className="d-flex justify-content-between mb-3 top-buttons">
            <div className="col-4"></div>
            <h3 className="justify-content-center col-4">File Already Uploaded</h3>
            <div className="col-4"></div>
        </div>
    </div>
        <div className="container-fluid py-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="col-4"></div>
                <div id="inform" className="container col-4">
                    <div id="file-upload-form" className="file-added">
                        <label style={{ height: "fit-content" }} htmlFor="file-upload" id="file-drag">
                            <button className="btn btn-success" data-toggle="modal" data-target="#UploadScreenErrorModal" onClick={handleEdit}>Edit Current File</button>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <label htmlFor="file-upload" className="btn btn-secondary">
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
                        </label>
                    </div>
                </div>
                <div className="container-fluid py-3">
                    <div className="col-4"></div>
                </div>
            </div>
        </div></>
}