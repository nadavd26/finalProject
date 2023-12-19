import rowDeleteImage from '../Images/deleteRow.png'
import rowAddImage from '../Images/addRow.png'
export default function RowActionCell({onRowDelete, onRowAdd}) {
    return <td id="deleteRow" className='cell100 first-column static-position '>
        <button className="border-0 p-0 no-outline actionButton" onClick={onRowDelete} >
            <img src={rowDeleteImage} alt="Image" className="img-fluid actionImage"/>
        </button>
        <button className="border-0 p-0 no-outline actionButton" onClick={onRowAdd} >
            <img src={rowAddImage} alt="Image" className="img-fluid actionImage"/>
        </button>
    </td>
}