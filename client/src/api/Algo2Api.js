export async function generateAlgo2Results(token, getFromDatabase, autoComplete, empty) {
    var data = "?getFromDatabase="
    data += getFromDatabase ? "true" : "false"
    //old
        // data += "?autoComplete="
        // data += autoComplete ? "true" : "false"
        // data += "?empty="
        // data += empty ? "true" : "false"
    //new
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
        console.log("responseData")
        console.log(responseData)
        return responseData
    } catch (error) {
        console.error("Error fetching results:", error);
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

export function postAlgo2Results(token, data, callback) {
    fetch('http://localhost:12345/Results/GetResults2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                callback(true);
            } else {
                callback(false);
            }
        })
        .catch(() => callback(false));
}