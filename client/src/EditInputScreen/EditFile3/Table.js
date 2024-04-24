import React from 'react';
import TableRowMemo from './TableRow';
//first row : [{name : , validate : function}, ....]
const TableRows = ({ content, errors, onCellEdit,  onRowDelete, onRowAdd, rowsToRender}) => {
    return (
        content.map((rowMap, index) => (
            <TableRowMemo
                rowIndex={index}
                row={rowMap}
                rowErrors={errors[index]}
                onRowDelete={onRowDelete}
                onCellEdit={onCellEdit}
                onRowAdd={onRowAdd}
                shouldRender={rowsToRender[index]}
            />
        ))
    );
}
function Table({content, errors, onCellEdit, onRowDelete, onRowAdd, rowsToRender}) {
    return (
        <div className="container-table100">
            <div className="wrap-table100">
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th className="cell100 col-1 first-column blue static-position" id="first-row-first-col"></th>                                    
                                    <th class="cell100  last-columns blue col-3">Skill</th>
                                    <th class="cell100  second-column blue col-2">Day</th>
                                    <th class="cell100  last-columns blue col-2">From</th>
                                    <th class="cell100  last-columns blue col-2">Until</th>
                                    <th class="cell100  last-columns blue col-2">Cost</th>
                                </tr>
                                <TableRows content={content} errors={errors} onCellEdit={onCellEdit} onRowDelete={onRowDelete}  onRowAdd={onRowAdd} rowsToRender={rowsToRender}/>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;

