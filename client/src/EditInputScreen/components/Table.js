import React from 'react';
import TableRows from './TableRows';
//first row : [{name : , validate : function}, ....]
function Table({ firstRow, content, onCellEdit  }) {
    return (
        <div className="container-table100">
            <div className="wrap-table100">
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th className="cell100 first-column first-column-body blue">{firstRow[0].name}</th>
                                    {firstRow.slice(1).map((column, index) => (
                                        <th className="cell100 last-columns blue">{column.name}</th>
                                    ))}
                                </tr>
                                <TableRows firstRow={firstRow} content={content} onCellEdit={onCellEdit}/>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;
