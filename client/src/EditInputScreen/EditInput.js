import EditFile2 from "./EditFile2/EditFile2";
import { useEffect, useState } from "react";
import { csvToArray } from "./Utils";

export default function EditInput({ file, numOfFile, setEditInfo }) {
    const [csvArray, setCsvArray] = useState([]);
    const [error, setError] = useState(null);

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
        }
    }, [file]);

    if (error) {
        setEditInfo({inEdit : false, errorMsg : "Cannot parse this file"})
    }

    if (numOfFile === 1 || numOfFile === 3) {
        return null;
    }

    if (numOfFile === 2) {
        return <EditFile2 csvArray={csvArray} setEditInfo={setEditInfo} />;
    }
}
