import TableRow from "./TableRow";
export default function TableRows({ content }) {
    return (
        content.map((row, index) => (
            <TableRow
                key={index}
                row={row}
            />
        ))
    );
}
