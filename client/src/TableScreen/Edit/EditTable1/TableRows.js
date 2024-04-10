import TableRow from "./TableRow";
//first row : [{name : , validate : function}, ....]
export default function TableRows({ content, isNumberOfWorkersValid, onCellEdit}) {
    return (
        content.map((rowMap, index) => (
            <TableRow
                rowIndex={index}
                row={rowMap}
                isNumberOfWorkersValid={isNumberOfWorkersValid}
                onCellEdit={onCellEdit}
            />
        ))
    );
}
