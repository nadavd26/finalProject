import info from '../Images/info.png'
export default function ActionCell({getLineInfo, rowIndex, color}) {
    return <td id="deleteRow" className='cell100 first-column static-position '>
        <h6>{rowIndex + 1}</h6>
        <button className="border-0 p-0 no-outline actionButton" onClick={() => getLineInfo(rowIndex)} >
            <img src={info} alt="Image" className="img-fluid actionImage"/>
        </button>
    </td>
}