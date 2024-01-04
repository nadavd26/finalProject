export async function getInputTable(tableNum, token) {
    var key = "table" + tableNum + "Content"
    const res = await fetch('http://localhost:12345/Table/' + tableNum, {
        'method': 'get',
        'headers': {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token
        }
    });

    // Show the server's response    
    if (!res.ok) {
        return null;
    }

    const body = await res.text()
    const table = JSON.parse(body);
    return table[key]
}

export async function postInputTable(tableNum, table, token) {
    const data = {content : JSON.stringify(table)}
    console.log(token)
    const res = await fetch('http://localhost:12345/Table/' + tableNum, {
        'method': 'post',
        'headers': {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token
        },
        'body': JSON.stringify(data)
    });

    console.log(JSON.stringify(table))

    console.log(await res.text())
}