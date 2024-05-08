import TableRowMemo from "./TableRow";
//first row : [{name : , validate : function}, ....]
export default function TableRows({ content, errors, onCellEdit,  onRowDelete, onRowAdd}) {
    return (
        content.map((rowMap, index) => (
            <TableRowMemo
                rowIndex={index}
                row={rowMap}
                rowErrors={errors[index]}
                onRowDelete={onRowDelete}
                onCellEdit={onCellEdit}
                onRowAdd={onRowAdd}
            />
        ))
    );
}