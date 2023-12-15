import React from 'react';
import TableRows from './TableRows';
//first row : [{name : , validate : function}, ....]
function Table({ firstRow, content, onCellEdit, onRowDelete, onRowAdd  }) {
    return (
        <div className="container-table100">
            <div className="wrap-table100">
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th className="cell100 first-column first-column-body"></th>
                                    {firstRow.map((column, index) => (
                                        <th className={`cell100  ${index === 0 ? 'second-column' : 'last-columns'} blue`}>{column.name}</th>
                                    ))}
                                </tr>
                                <TableRows firstRow={firstRow} content={content} onCellEdit={onCellEdit} onRowDelete={onRowDelete} onRowAdd={onRowAdd}/>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;
