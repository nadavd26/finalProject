import React from 'react';
import TableRows from './TableRows';
function Table({ firstRow, content }) {
    return (
        <div className="container-table100">
            <div className="wrap-table100">
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th className="cell100 first-column first-column-body blue static-position">{firstRow[0]}</th>
                                    {firstRow.slice(1).map((headline, index) => (
                                        <th className="cell100 last-columns blue">{headline}</th>
                                    ))}
                                </tr>
                                <TableRows content={content} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;
