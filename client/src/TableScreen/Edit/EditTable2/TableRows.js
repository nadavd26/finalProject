import TableRow from "./TableRow";
//first row : [{name : , validate : function}, ....]
export default function TableRows({ content, isNumberOfWorkersValid, onCellEdit,  colors, workerMap, shiftsPerWorker, shiftsInfo}) {
    return (
        content.map((rowMap, index) => (
            <TableRow
                rowIndex={index}
                row={rowMap}
                isNumberOfWorkersValid={isNumberOfWorkersValid}
                onCellEdit={onCellEdit}
                color={colors[index]}
                workerMap={workerMap}
                shiftsPerWorker={shiftsPerWorker}
                shiftsInfo={shiftsInfo}
                content={content}
            />
        ))
    );
}
