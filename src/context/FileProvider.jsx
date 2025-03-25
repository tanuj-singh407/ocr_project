import { useState } from "react";
import { FileContext } from "./FileContext";

// Provider Component
export const FileProvider = ({ children }) => {
    const [extractedData, setExtractedData] = useState(null);
    const [statusarr, setstatusarr] = useState([])
    const [filearr, setfilearr] = useState([]);
    const [loadingStates, setLoadingStates] = useState([]);
    const [editstatus, seteditstatus] = useState(false)
    const [imgstatus, setimgstatus] = useState(true)
    const [submitvalue, setsubmitvalue] = useState(["Submit", false])

    return (
        <FileContext.Provider value={{
            filearr, setfilearr, loadingStates,
            setLoadingStates, extractedData, setExtractedData,
            editstatus, seteditstatus, imgstatus,
            setimgstatus, statusarr, setstatusarr,
            submitvalue, setsubmitvalue
        }}>
            {children}
        </FileContext.Provider>
    );
};