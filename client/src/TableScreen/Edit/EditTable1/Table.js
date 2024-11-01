import React from 'react';
import TableRowMemo from './TableRow';
// import TableRow from './TableRow';
const TableRows = ({ content, isNumberOfWorkersValid, onCellEdit, rowsToRender}) => {
    
    return (
        content.map((rowMap, index) => (
            <TableRowMemo
                rowIndex={index}
                row={rowMap}
                isNumberOfWorkersValid={isNumberOfWorkersValid}
                onCellEdit={onCellEdit}
                shouldRender={rowsToRender[index]}
            />
        ))
    );
}
function Table({content, isNumberOfWorkersValid, onCellEdit, rowsToRender}) {
    return (
        <div className="container-table100">
            <div className="wrap-table100">
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th className="cell100 first-column blue col-2">Day</th>
                                    <th class="cell100  last-columns blue col-3">Skill</th>
                                    <th class="cell100  last-columns blue col-1">From</th>
                                    <th class="cell100  last-columns blue col-1">Until</th>
                                    <th class="cell100  last-columns blue col-3">Assinged Number Of Workers</th>
                                    <th class="cell100  last-columns blue col-2">Cost</th>
                                </tr>
                                <TableRows content={content} isNumberOfWorkersValid={isNumberOfWorkersValid} onCellEdit={onCellEdit} rowsToRender={rowsToRender}/>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;

