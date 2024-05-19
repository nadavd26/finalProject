import EditFile2 from "./EditFile2/EditFile2";
import EditFile1 from "./EditFile1/EditFile1";
import EditFile3 from "./EditFile3/EditFile3";
import { useEffect, useState } from "react";
import { csvToArray } from "./Utils";
import { getInputTable, postInputTable, sortTable } from "../api/InputTableApi";

export default function EditInput({ file, numOfFile, setEditInfo, user, setUser, setCurrentFile }) {
    const token = user.token
    const [fromServer, setFromServer] = useState(true)
    const [csvArray, setCsvArray] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const setTable = () => {
            try {
                var table = null
                switch (numOfFile) {
                    case 1:
                        table = JSON.parse(JSON.stringify(user.table1))
                        break
                    case 2:
                        table = JSON.parse(JSON.stringify(user.table2))
                        break
                    default:
                        table = JSON.parse(JSON.stringify(user.table3))
                        break                                
                }
                if (table) {
                    setCsvArray(table);
                }
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
            setFromServer(false)
            const reader = new FileReader();
            reader.onload = async function (e) {
                try {
                    const csv_data = e.target.result;
                    const csv_array = csvToArray(csv_data, ',', false);
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
        return <EditFile1 csvArray={csvArray} setEditInfo={setEditInfo} user={user}  setUser={setUser} fromServer={fromServer}/>;
    }

    if (numOfFile === 2) {
        return <EditFile2 csvArray={csvArray} setEditInfo={setEditInfo} user={user}  setUser={setUser} fromServer={fromServer}/>;
    }

    if (numOfFile === 3) {
        return <EditFile3 csvArray={csvArray} setEditInfo={setEditInfo} user={user}  setUser={setUser} fromServer={fromServer}/>;
    }
}
