import EditFile2 from "./EditFile2/EditFile2";
export default function EditInput({file, numOfFile, setInEdit}) {
    if (numOfFile == 1) {
        return null
    } 
    if (numOfFile == 2) {
        return <EditFile2 file={file} setInEdit={setInEdit}/>
    }

    if (numOfFile == 3) {
        return null
    }
}