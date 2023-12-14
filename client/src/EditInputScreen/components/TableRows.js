import TableRow from "./TableRow";
//first row : [{name : , validate : function}, ....]
export default function TableRows({ content, onCellEdit, firstRow }) {
    return (
        content.map((row, index) => (
            <TableRow
                rowIndex={index}
                row={row}
                onCellEdit={onCellEdit}
                firstRow={firstRow}
            />
        ))
    );
}
