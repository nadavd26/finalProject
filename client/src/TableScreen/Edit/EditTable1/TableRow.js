import "../css/TableRow.css"; // Import your CSS file for styling
import FreeEditCell from '../components/FreeEditCell';
import NonEditableCell from "../components/NonEditableCell";
export default function TableRow({ row, isNumberOfWorkersValid, rowIndex, onCellEdit}) {

    return (
        <>
            <tr className="row100 body last-rows" id="table-row">
                <NonEditableCell value={row[0]} rowIndex={rowIndex} coloumnIndex={0}/>
                <NonEditableCell value={row[1]} rowIndex={rowIndex} columnIndex={1} />
                <NonEditableCell value={row[2]} rowIndex={rowIndex} columnIndex={2}  />
                <NonEditableCell value={row[3]} rowIndex={rowIndex} columnIndex={3}  />
                <FreeEditCell value={row[4]} rowIndex={rowIndex} columnIndex={4} isValid={isNumberOfWorkersValid(row[4])} onEdit={onCellEdit}/>
            </tr >
        </>
    );
}
