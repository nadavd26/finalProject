import React from 'react';
import TableRows from './TableRows';
//first row : [{name : , validate : function}, ....]
function Table({content, onCellEdit,  setContent, workerMap, shiftsInfo}) {
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
                                <TableRows content={content[0].table} setContent={setContent[0]} onCellEdit={onCellEdit} colors={content[0].colors} workerMap={workerMap} shiftsPerWorker={content[0].shiftsPerWorkers} shiftsInfo={shiftsInfo.Sunday}/>
                                <TableRows content={content[1].table} setContent={setContent[1]} onCellEdit={onCellEdit} colors={content[1].colors} workerMap={workerMap} shiftsPerWorker={content[1].shiftsPerWorkers} shiftsInfo={shiftsInfo.Monday}/>
                                <TableRows content={content[2].table} setContent={setContent[2]} onCellEdit={onCellEdit} colors={content[2].colors} workerMap={workerMap} shiftsPerWorker={content[2].shiftsPerWorkers} shiftsInfo={shiftsInfo.Tuesday}/>
                                <TableRows content={content[3].table} setContent={setContent[3]} onCellEdit={onCellEdit} colors={content[3].colors} workerMap={workerMap} shiftsPerWorker={content[3].shiftsPerWorkers} shiftsInfo={shiftsInfo.Wednesday}/>
                                <TableRows content={content[4].table} setContent={setContent[4]} onCellEdit={onCellEdit} colors={content[4].colors} workerMap={workerMap} shiftsPerWorker={content[4].shiftsPerWorkers} shiftsInfo={shiftsInfo.Thursday}/>
                                <TableRows content={content[5].table} setContent={setContent[5]} onCellEdit={onCellEdit} colors={content[5].colors} workerMap={workerMap} shiftsPerWorker={content[5].shiftsPerWorkers} shiftsInfo={shiftsInfo.Friday}/>
                                <TableRows content={content[6].table} setContent={setContent[6]} onCellEdit={onCellEdit} colors={content[6].colors} workerMap={workerMap} shiftsPerWorker={content[6].shiftsPerWorkers} shiftsInfo={shiftsInfo.Saturday}/>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;

