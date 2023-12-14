import TableRow from "./TableRow";
//first row : [{name : , validate : function}, ....]
export default function TableRows({ content, onCellEdit, firstRow, onRowDelete, onRowAdd }) {
    return (
        content.map((rowMap, index) => (
            <TableRow
                rowIndex={index}
                row={rowMap.value}
                onRowDelete={onRowDelete}
                onRowAdd={onRowAdd}
                onCellEdit={onCellEdit}
                firstRow={firstRow}
            />
        ))
    );
}
