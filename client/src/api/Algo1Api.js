export async function validateAlgo1Table1(token) {
    const table1algo1url = 'http://localhost:12345/Validation/validateTable1Algo1'
    const res = await fetch(table1algo1url, {
        'method': 'get',
        'headers': {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token
        }
    });

    // Show the server's response    
    const body = await res.text()
    console.log("body")
    console.log(body)
    return JSON.parse(body)
}

export function generateAlgo1Results(token, getFromDatabase, callback) {
    var data = "?getFromDatabase=";
    data += getFromDatabase ? "true" : "false";

    const url = "http://localhost:12345/Results/GetResults1" + data;

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + token
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            // Convert the responseData to a Map object
            const resultMap = new Map();
            for (const key in responseData) {
                resultMap.set(key, responseData[key]);
            }
            callback(resultMap); // Call the callback with the result
        })
        .catch(error => {
            console.error("Error fetching results:", error);
            callback(null, error); // Call the callback with an error
        });
}

export async function postAlgo1Res(table, token) {
    const data = { content: JSON.stringify(table) }
    const res = await fetch('http://localhost:12345/Results/GetResults1', {
        'method': 'post',
        'headers': {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token
        },
        'body': JSON.stringify(data)
    });
}