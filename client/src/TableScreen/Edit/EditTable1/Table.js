import React from 'react';
import TableRows from './TableRows';
//first row : [{name : , validate : function}, ....]
function Table({content, isNumberOfWorkersValid, onCellEdit}) {
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
                                    <th class="cell100  last-columns blue col-3">From</th>
                                    <th class="cell100  last-columns blue col-2">Until</th>
                                    <th class="cell100  last-columns blue col-2">Assinged Number Of Workers</th>
                                </tr>
                                <TableRows content={content} isNumberOfWorkersValid={isNumberOfWorkersValid} onCellEdit={onCellEdit}/>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;

