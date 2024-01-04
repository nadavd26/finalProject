import EditFile2 from "./EditFile2/EditFile2";
import { useEffect, useState } from "react";
import { csvToArray } from "./Utils";
import { getInputTable } from "../api/InputTableApi";

export default function EditInput({ file, numOfFile, setEditInfo, token }) {
    const [csvArray, setCsvArray] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchAndSetTable = async () => {
            try {
                const table = await getInputTable(numOfFile, token);
                if (table) {
                    setCsvArray(table);
                }
                console.log("table is : " + JSON.stringify(table))
            } catch (error) {
                setError(error);
            }
        };
        // Call fetchAndSetTable on every render
        if (!file) {
            fetchAndSetTable()
        }
    }, [numOfFile, token]);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const csv_data = e.target.result;
                    const csv_array = csvToArray(csv_data, ',', false);
                    console.log("-----------------")
                    csv_array.forEach(row => {
                        console.log(row);
                    });                    
                    setCsvArray(csv_array);
                    console.log("-----------------")
                } catch (error) {
                    setError(error);
                }
            };

            reader.readAsText(file);
        } else {
        }
    }, [file]);

    if (error) {
        setEditInfo({inEdit : false, errorMsg : "Cannot parse this file"})
    }

    if (numOfFile === 1 || numOfFile === 3) {
        return null;
    }

    if (numOfFile === 2) {
        return <EditFile2 csvArray={csvArray} setEditInfo={setEditInfo} token={token}/>;
    }
}
