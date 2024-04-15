import React from 'react';
import TableRows from './TableRows';
//first row : [{name : , validate : function}, ....]
function Table({content, onCellEdit,  colors, workerMap, shiftsPerWorker, shiftsInfo}) {
    return (
        <div className="container-table100">
            <div className="wrap-table100">
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row">
                                <th className="cell100 col-1 first-column blue static-position" id="first-row-first-col"></th>
                                    <th class="cell100  last-columns blue col-2">Day</th>
                                    <th class="cell100  last-columns blue col-2">Skill</th>
                                    <th class="cell100  last-columns blue col-2">From</th>
                                    <th class="cell100  last-columns blue col-2">Until</th>
                                    <th class="cell100  last-columns blue col-3">Assigned Worker</th>
                                </tr>
                                <TableRows content={content[0]} onCellEdit={onCellEdit} colors={colors} workerMap={workerMap} shiftsPerWorker={shiftsPerWorker} shiftsInfo={shiftsInfo}/>
                                <TableRows content={content[1]} onCellEdit={onCellEdit} colors={colors} workerMap={workerMap} shiftsPerWorker={shiftsPerWorker} shiftsInfo={shiftsInfo}/>
                                <TableRows content={content[2]} onCellEdit={onCellEdit} colors={colors} workerMap={workerMap} shiftsPerWorker={shiftsPerWorker} shiftsInfo={shiftsInfo}/>
                                <TableRows content={content[3]} onCellEdit={onCellEdit} colors={colors} workerMap={workerMap} shiftsPerWorker={shiftsPerWorker} shiftsInfo={shiftsInfo}/>
                                <TableRows content={content[4]} onCellEdit={onCellEdit} colors={colors} workerMap={workerMap} shiftsPerWorker={shiftsPerWorker} shiftsInfo={shiftsInfo}/>
                                <TableRows content={content[5]} onCellEdit={onCellEdit} colors={colors} workerMap={workerMap} shiftsPerWorker={shiftsPerWorker} shiftsInfo={shiftsInfo}/>
                                <TableRows content={content[6]} onCellEdit={onCellEdit} colors={colors} workerMap={workerMap} shiftsPerWorker={shiftsPerWorker} shiftsInfo={shiftsInfo}/>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;

