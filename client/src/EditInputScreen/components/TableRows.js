import TableRow from "./TableRow";
//first row : [{name : , validate : function}, ....]
export default function TableRows({ content, onCellEdit, firstRow, onRowDelete, onRowAdd, isNumberOfWorkersValid, isSkillValid }) {
    return (
        content.map((rowMap, index) => (
            <TableRow
                rowIndex={index}
                row={rowMap}
                onRowDelete={onRowDelete}
                onRowAdd={onRowAdd}
                onCellEdit={onCellEdit}
                firstRow={firstRow}
                isNumberOfWorkersValid={isNumberOfWorkersValid}
                isSkillValid={isSkillValid}
            />
        ))
    );
}
