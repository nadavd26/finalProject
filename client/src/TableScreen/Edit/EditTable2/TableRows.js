import TableRow from "./TableRow";
//first row : [{name : , validate : function}, ....]
export default function TableRows({content, onCellEdit, colors, workerMap, shiftsPerWorker, shiftsInfo, generateWorkerList}) {
    return (
        content.map((rowMap, index) => (
            <TableRow
                rowIndex={index}
                row={rowMap}
                color={colors[index]}
                workerMap={workerMap}
                shiftsInfo={shiftsInfo}
                generateWorkerList={generateWorkerList}
                onCellEdit={onCellEdit}
            />
        ))
    );
}
