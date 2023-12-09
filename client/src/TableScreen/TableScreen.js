import Table from "./conponenets/Table";
import Upload from './images/uploadImage.webp'
//expecting json: [{"worker":"name1", "shifts":[true, true, false, ...]}, {"worker":"name2", "shifts":[true, true, false, ...]}, ....]
function TableScreen({ workersAndShifts }) {
    return (
            <div>
                <div className="container-fluid py-3">
                    <div className="d-flex justify-content-between mb-3 top-buttons">
                        <div className="col-1"></div>
                        <button className="btn btn-secondary col-4">Amount of employees required for each shift</button>
                        <button className="btn btn-primary col-4">Allocation of employees</button>
                        <button className="btn btn-success col-2">
                            <img src={Upload} alt="Upload" className="upload-image" />
                        </button>
                        <div className="col-1"></div>
                    </div>
                    <Table workersAndShifts={workersAndShifts}></Table>
                    <div className="row"><br/></div>
                    <div className="d-flex justify-content-between mb-3 down-buttons">
                        <div className="col-3"></div>
                        <button className="btn btn-secondary col-3">Edit</button>
                        <button className="btn btn-secondary col-3 save-btn">Save</button>
                        <div className="col-3"></div>
                    </div>
                </div>
            </div>)
}

export default TableScreen;