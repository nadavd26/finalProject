import EditFile2 from "./EditFile2/EditFile2";
import EditFile1 from "./EditFile1/EditFile1";
import { useEffect, useState } from "react";
import { csvToArray } from "./Utils";
import { getInputTable, postInputTable, sortTable } from "../api/InputTableApi";

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
                    console.log("whatttttttttttttttttttttttttttttttttttttttttt")
                    // csv_array.forEach(row => {
                    //     console.log(row);
                    // });
                    // const sorted_table = await sortTable(numOfFile, csv_array, token)
                    // console.log("sorted table is:")
                    // console.log(sorted_table)
                    // sortTable.forEach(row => {
                    //     console.log(row);
                    // });     
                    // console.log("----------------sssssssssssssssssss-")               
                    // setCsvArray(sorted_table);
                    setCsvArray(csv_array);

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

    if (numOfFile === 1) {
        return <EditFile1 csvArray={csvArray} setEditInfo={setEditInfo} user={user}  setUser={setUser}/>;
    }

    if (numOfFile === 2) {
        return <EditFile2 csvArray={csvArray} setEditInfo={setEditInfo} user={user}  setUser={setUser}/>;
    }

    if (numOfFile === 3) {
        return null;
    }
}
