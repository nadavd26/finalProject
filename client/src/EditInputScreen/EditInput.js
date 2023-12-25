import EditFile2 from "./EditFile2/EditFile2";
import { useEffect, useState } from "react";

import { csv_to_array } from "./Utils";

export default function EditInput({ file, numOfFile, setInEdit }) {
    const [csvArray, setCsvArray] = useState([]);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const csv_data = e.target.result;
                const csv_array = csv_to_array(csv_data, ',', false)
                setCsvArray(csv_array);                      
            };
            reader.readAsText(file);
        }
    }, [file]);

    if (numOfFile === 1 || numOfFile === 3) {
        return null;
    }

    if (numOfFile === 2) {
        return <EditFile2 csvArray={csvArray} setInEdit={setInEdit} />;
    }
}
