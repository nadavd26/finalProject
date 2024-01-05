import EditFile2 from "./EditFile2/EditFile2";
import { useEffect, useState } from "react";
import { csvToArray } from "./Utils";
import { getInputTable, postInputTable } from "../api/InputTableApi";

export default function EditInput({ file, numOfFile, setEditInfo, user, setUser, setCurrentFile }) {
    const token = user.token
    const [csvArray, setCsvArray] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const setTable = () => {
            try {
                var table = null
                switch (numOfFile) {
                    case 1:
                        table = user.table1
                        break
                    case 2:
                        table = user.table2
                        break
                    default:
                        table = user.table3
                        break                                
                }
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
            setTable()
        }
    }, [numOfFile, token]);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = async function (e) {
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

                setCurrentFile(null) //cleaning input file
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
        return <EditFile2 csvArray={csvArray} setEditInfo={setEditInfo} user={user}  setUser={setUser}/>;
    }
}
