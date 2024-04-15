import TableRow from "./TableRow";
//first row : [{name : , validate : function}, ....]
export default function TableRows({ content, setContent, colors, workerMap, shiftsPerWorker, shiftsInfo}) {
    return (
        content.map((rowMap, index) => (
            <TableRow
                rowIndex={index}
                row={rowMap}
                setContentColors={setContent}
                color={colors[index]}
                colors={colors}
                workerMap={workerMap}
                shiftsPerWorker={shiftsPerWorker}
                shiftsInfo={shiftsInfo}
                content={content}
            />
        ))
    );
}
