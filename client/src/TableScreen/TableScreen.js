import Table from "./conponenets/Table";
import Upload from './images/uploadImage.webp'
import './css/bootstrap.min.css'
import './css/table-main.css'
import './css/perfect-scrollbar.css'
// expecting json: [{"worker":"name1", "shifts":[true, true, false, ...]}, {"worker":"name2", "shifts":[true, true, false, ...]}, ....]
// every boolean array is 48 cells, starting from 7:00, ending at 23:30
function TableScreen({ workersAndShifts }) {
    return (
        <div id="table-screen">
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
                <div className="row">
                    <div className="col-5"></div>
                    <div class="dropdown col-2">
                        <button class="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Sunday
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <button className="dropdown-item" href="#">Monday</button>
                            <button className="dropdown-item" href="#">Tuesday</button>
                            <button className="dropdown-item" href="#">Wednesday</button>
                            <button className="dropdown-item" href="#">Thursday</button>
                            <button className="dropdown-item" href="#">Friday</button>
                            <button className="dropdown-item" href="#">Saturday</button>
                        </div>
                    </div>
                    <div className="col-5"></div>
                </div>
                <br></br>
                <Table workersAndShifts={workersAndShifts}></Table>
                <div className="row"><br /></div>
                <div className="d-flex justify-content-between mb-3 down-buttons">
                    <div className="col-2"></div>
                    <button className="btn btn-secondary col-4">Edit</button>
                    <button className="btn btn-secondary col-4 save-btn">Save</button>
                    <div className="col-2"></div>
                </div>
            </div>
        </div>)
}

export default TableScreen;