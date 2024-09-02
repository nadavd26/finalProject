import React, { useEffect, useRef, useState } from 'react';
import TableRowMemo from './TableRow'
import Loader from "../../components/Loader";
const TableRows = ({ content, errors, onCellEdit, onRowDelete, onRowAdd, rowsToRender, initialRender, initialRenderUpdate }) => {
    const [renderedRows, setRenderedRows] = useState([]);
    var initRend = useRef(initialRender)
    const render_all = () => {
        //regular rendering
        console.log("rendering all")
        console.log(rowsToRender)
        const allRows = content.map((rowMap, index) => (
            <TableRowMemo
                rowIndex={index}
                row={rowMap}
                rowErrors={errors[index]} // Ensure rowErrors are defined
                onRowDelete={onRowDelete}
                onCellEdit={onCellEdit}
                onRowAdd={onRowAdd}
                shouldRender={rowsToRender[index]}
                enableEdit={true}
            />
        ));

        setRenderedRows(allRows); // Set all rows at once
    }
    useEffect(() => {
        if (initialRender && content.length != 0) {
            console.log("rendering chunks")
            let i = 0;
            const delay = 1; // Adjust this delay as needed
            const chunkSize = 9; // Number of rows to render per chunk
            const renderChunk = () => {
                if (i < content.length) {
                    const newRows = [];
                    for (let index = i; index < i + chunkSize && index < content.length; index++) {
                        const rowMap = content[index];
                        const rowErrors = errors[index]
                        newRows.push(
                            <TableRowMemo
                                key={index}
                                rowIndex={index}
                                row={rowMap}
                                rowErrors={rowErrors}
                                onRowDelete={onRowDelete}
                                onCellEdit={onCellEdit}
                                onRowAdd={onRowAdd}
                                shouldRender={true}
                                enableEdit={false}
                            />
                        );
                    }
                    setRenderedRows(prevRows => [...prevRows, ...newRows]);
                    i += chunkSize;
                    setTimeout(renderChunk, delay); // Schedule the next chunk render
                } else {
                    //finished rendering, updating ref
                    render_all()
                    initialRenderUpdate(false)
                }
            };
            renderChunk();
        } else {
            render_all()
        }
    }, [content])
    return (
        <>
            {initialRender && (
                <div>
                    <Loader speed={5} customText="Loading Table..." />
                </div>
            )}
            {renderedRows}
        </>


    );
}
//first row : [{name : , validate : function}, ....]
function Table({ content, errors, onCellEdit, onRowDelete, onRowAdd, rowsToRender, initialRender, initialRenderUpdate }) {
    return (
        <div className="container-table100">
            <div className="wrap-table100">
                <div className="ver1 m-b-110">
                    <div className="table100-body scrollbar">
                        <table className="table table-hover table-striped" id="table">
                            <tbody>
                                <tr className="row100 body first-row">
                                    <th className="cell100 col-1 first-column blue static-position" id="first-row-first-col"></th>
                                    <th class="cell100  second-column blue col-1">Id</th>
                                    <th class="cell100  last-columns blue col-2">Name</th>
                                    <th class="cell100  last-columns blue col-2">Skill1</th>
                                    <th class="cell100  last-columns blue col-2">Skill2</th>
                                    <th class="cell100  last-columns blue col-2">Skill3</th>
                                    <th class="cell100  last-columns blue col-1">Min Hours</th>
                                    <th class="cell100  last-columns blue col-1">Max Hours</th>
                                </tr>
                                <TableRows content={content} errors={errors} onCellEdit={onCellEdit} onRowDelete={onRowDelete} onRowAdd={onRowAdd} rowsToRender={rowsToRender} initialRender={initialRender} initialRenderUpdate={initialRenderUpdate} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;

