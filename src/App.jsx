import { useState, useEffect } from "react"
import Filetable from "./components/Filetable"

import Imagecontainer from "./components/Imagecontainer"
import Navbar from "./components/Navbar"
import Editfile from "./components/editfile";
import ExtractedData from "./components/ExtractedData";
import ExtractedData2 from "./components/ExtractedData2";

function App() {

  const [fileData, setFileData] = useState(null);
  const [orgfile, setorgFile] = useState('');

  const [E_filekey, setE_filekey] = useState('')

  // Function to receive file details from ImageUploader
  const handleFileSubmit = (fileDetails, file) => {
    setorgFile(file)
    setFileData(fileDetails);
  };

  const editkey = (key) => {
    setE_filekey(key)
  }

  return (
    <>
      <Navbar />
      <Imagecontainer onFileSubmit={handleFileSubmit} />
      <Filetable fileData={[fileData, orgfile]} Editkey={editkey} />
      <Editfile Key={E_filekey} />
      {/* <ExtractedData /> */}
      <ExtractedData2 />
    </>
  )
}

export default App
