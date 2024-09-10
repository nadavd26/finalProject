export async function generateAlgo2Results(token, getFromDatabase, autoComplete, empty) {
    var data = "?getFromDatabase="
    data += getFromDatabase ? "true" : "false"
    data += "&autoComplete=" + (autoComplete ? "true" : "false");
    data += "&empty=" + (empty ? "true" : "false");

    try {
        const url = "http://localhost:12345/Results/GetResults2" + data;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'bearer ' + token
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`); //cannot happen
        }

        const responseData = await response.json(); // Parse JSON response


        return responseData
    } catch (error) {
        console.error("Error fetching results:", error);
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

export async function postAlgo2Results(token, changeInfo) {
    await fetch('http://localhost:12345/Results/GetResults2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + token
        },
        body: JSON.stringify(changeInfo)
    })
}

export async function getTableInfomarion(token) {
    const res = await fetch('http://localhost:12345/Validation/validateAlgo2', {
        'method': 'get',
        'headers': {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token
        }
    });

    const body = await res.text()
    console.log(body)
    return body
}