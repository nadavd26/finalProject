import TableRow from "./TableRow";
//first row : [{name : , validate : function}, ....]
export default function TableRows({ content, isNumberOfWorkersValid, onCellEdit,  color, workerMap}) {
    return (
        content.map((rowMap, index) => (
            <TableRow
                rowIndex={index}
                row={rowMap}
                isNumberOfWorkersValid={isNumberOfWorkersValid}
                onCellEdit={onCellEdit}
                color={color}
                workerMap={workerMap}
            />
        ))
    );
}
