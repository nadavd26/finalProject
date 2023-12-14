export default function TableRow({row}) {
    if (row.length == 0) {
        return
    }
    return <tr className="row100 body last-rows">
            <td className={`cell100 first-column static-position gray`}>{row[0]}</td>
            {row.slice(1).map((value, index) => (
                <td key={index} className={`cell100 last-columns gray`}>{value}</td>
            ))}
        </tr>
}