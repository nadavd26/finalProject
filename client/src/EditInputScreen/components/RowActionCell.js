import rowDeleteImage from '../Images/deleteRow.png'
import rowDupliacateImage from '../Images/duplicateRow.png'
export default function RowActionCell({onRowDelete, onRowAdd, rowIndex, enableEdit}) {
    return <td id="deleteRow" className='cell100 first-column static-position '>
        <h6>{rowIndex + 1}</h6>
        <button className="border-0 p-0 no-outline actionButton" onClick={onRowDelete} disabled={!enableEdit}>
            <img src={rowDeleteImage} alt="Image" className="img-fluid actionImage"/>
        </button>
        <button className="border-0 p-0 no-outline actionButton" onClick={onRowAdd} disabled={!enableEdit}>
            <img src={rowDupliacateImage} alt="Image" className="img-fluid actionImage"/>
        </button>
    </td>
}